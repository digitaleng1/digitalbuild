using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<ProjectService> _logger;

    public ProjectService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        ILogger<ProjectService> logger)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<ProjectDto> CreateProjectAsync(
        CreateProjectDto dto,
        string clientId,
        List<FileUploadInfo>? files = null,
        FileUploadInfo? thumbnail = null,
        CancellationToken cancellationToken = default)
    {
        var clientExists = await _context.Users.AnyAsync(u => u.Id == clientId, cancellationToken);
        if (!clientExists)
        {
            _logger.LogWarning("Client with ID {ClientId} not found", clientId);
            throw new ArgumentException($"Client with ID {clientId} not found", nameof(clientId));
        }

        var existingLicenseTypeIds = await _context.LicenseTypes
            .Where(lt => dto.LicenseTypeIds.Contains(lt.Id))
            .Select(lt => lt.Id)
            .ToListAsync(cancellationToken);

        if (existingLicenseTypeIds.Count != dto.LicenseTypeIds.Length)
        {
            var invalidIds = dto.LicenseTypeIds.Except(existingLicenseTypeIds);
            _logger.LogWarning("Invalid license type IDs: {InvalidIds}", string.Join(", ", invalidIds));
            throw new ArgumentException($"Invalid license type IDs: {string.Join(", ", invalidIds)}", nameof(dto.LicenseTypeIds));
        }

        if (!Enum.IsDefined(typeof(ProjectScope), dto.ProjectScope))
        {
            _logger.LogWarning("Invalid project scope: {ProjectScope}", dto.ProjectScope);
            throw new ArgumentException($"Invalid project scope: {dto.ProjectScope}", nameof(dto.ProjectScope));
        }

        var uploadedS3Keys = new List<string>();

        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                Status = ProjectStatus.QuotePending,
                ClientId = clientId,
                StreetAddress = dto.StreetAddress,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                ProjectScope = (ProjectScope)dto.ProjectScope,
                ManagementType = dto.ManagementType,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync(cancellationToken);

            if (thumbnail != null)
            {
                try
                {
                    var thumbnailKey = await _fileStorageService.UploadFileAsync(
                        thumbnail.FileStream,
                        $"thumbnail_{thumbnail.FileName}",
                        thumbnail.ContentType,
                        project.Id,
                        cancellationToken);
                    
                    project.ThumbnailUrl = thumbnailKey;
                    uploadedS3Keys.Add(thumbnailKey);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to upload thumbnail for project {ProjectId}", project.Id);
                    throw;
                }
            }

            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    if (file.FileSize == 0)
                        continue;

                    try
                    {
                        var fileKey = await _fileStorageService.UploadFileAsync(
                            file.FileStream,
                            file.FileName,
                            file.ContentType,
                            project.Id,
                            cancellationToken);

                        uploadedS3Keys.Add(fileKey);

                        var projectFile = new ProjectFile
                        {
                            ProjectId = project.Id,
                            FileName = file.FileName,
                            FileUrl = fileKey,
                            FileSize = file.FileSize,
                            ContentType = file.ContentType,
                            UploadedBy = clientId,
                            UploadedAt = DateTime.UtcNow
                        };

                        _context.ProjectFiles.Add(projectFile);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to upload file {FileName} for project {ProjectId}", 
                            file.FileName, project.Id);
                        throw;
                    }
                }
            }

            var projectLicenseTypes = dto.LicenseTypeIds
                .Select(ltId => new ProjectLicenseType
                {
                    ProjectId = project.Id,
                    LicenseTypeId = ltId
                })
                .ToList();

            _context.ProjectLicenseTypes.AddRange(projectLicenseTypes);
            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            string? thumbnailPresignedUrl = null;
            if (!string.IsNullOrEmpty(project.ThumbnailUrl))
            {
                thumbnailPresignedUrl = _fileStorageService.GetPresignedUrl(project.ThumbnailUrl);
            }

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Status = project.Status.ToString(),
                CreatedAt = project.CreatedAt,
                ThumbnailUrl = thumbnailPresignedUrl,
                StreetAddress = project.StreetAddress,
                City = project.City,
                State = project.State,
                ZipCode = project.ZipCode,
                ProjectScope = (int)project.ProjectScope,
                ManagementType = project.ManagementType.ToString(),
                LicenseTypeIds = dto.LicenseTypeIds
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error creating project '{Name}' for client {ClientId}. Rolling back transaction and cleaning up uploaded files.", 
                dto.Name, clientId);

            if (uploadedS3Keys.Count > 0)
            {
                _logger.LogWarning("Cleaning up {FileCount} uploaded files from S3", uploadedS3Keys.Count);
                
                foreach (var s3Key in uploadedS3Keys)
                {
                    try
                    {
                        await _fileStorageService.DeleteFileAsync(s3Key, cancellationToken);
                    }
                    catch (Exception deleteEx)
                    {
                        _logger.LogError(deleteEx, "Failed to delete file from S3: {S3Key}. Manual cleanup may be required.", s3Key);
                    }
                }
            }

            throw;
        }
    }

    public async Task<ProjectDetailsDto> GetProjectByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.ProjectLicenseTypes)
                .ThenInclude(plt => plt.LicenseType)
            .Include(p => p.Files)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (project == null)
        {
            throw new ProjectNotFoundException(id);
        }

        var client = await _context.Users
            .Where(u => u.Id == project.ClientId)
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email,
                u.ProfilePictureUrl
            })
            .FirstOrDefaultAsync(cancellationToken);

        string clientName = string.Empty;
        string clientEmail = string.Empty;
        string? clientProfilePictureUrl = null;

        if (client != null)
        {
            clientName = $"{client.FirstName ?? ""} {client.LastName ?? ""}".Trim();
            if (string.IsNullOrWhiteSpace(clientName))
            {
                clientName = client.Email ?? "Unknown Client";
            }
            clientEmail = client.Email ?? string.Empty;
            clientProfilePictureUrl = client.ProfilePictureUrl;
        }

        var licenseTypeIds = project.ProjectLicenseTypes
            .Select(plt => plt.LicenseTypeId)
            .ToArray();

        var licenseTypes = project.ProjectLicenseTypes
            .Select(plt => new LicenseTypeDto
            {
                Id = plt.LicenseType.Id,
                Name = plt.LicenseType.Name,
                Description = plt.LicenseType.Description,
                ProfessionId = plt.LicenseType.ProfessionId
            })
            .ToArray();

        string? thumbnailPresignedUrl = null;
        if (!string.IsNullOrEmpty(project.ThumbnailUrl))
        {
            thumbnailPresignedUrl = _fileStorageService.GetPresignedUrl(project.ThumbnailUrl);
        }

        var filesWithPresignedUrls = project.Files
            .Select(pf => new ProjectFileDto
            {
                Id = pf.Id,
                FileName = pf.FileName,
                FileUrl = _fileStorageService.GetPresignedUrl(pf.FileUrl),
                FileSize = pf.FileSize,
                ContentType = pf.ContentType,
                UploadedAt = pf.UploadedAt
            })
            .ToArray();

        return new ProjectDetailsDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status.ToString(),
            ClientId = project.ClientId,
            ClientName = clientName,
            ClientEmail = clientEmail,
            ClientProfilePictureUrl = clientProfilePictureUrl,
            StreetAddress = project.StreetAddress,
            City = project.City,
            State = project.State,
            ZipCode = project.ZipCode,
            ProjectScope = (int)project.ProjectScope,
            ManagementType = project.ManagementType.ToString(),
            LicenseTypeIds = licenseTypeIds,
            LicenseTypes = licenseTypes,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            ThumbnailUrl = thumbnailPresignedUrl,
            Files = filesWithPresignedUrls
        };
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsAsync(
        string userId, 
        string[] userRoles, 
        CancellationToken cancellationToken = default)
    {
        IQueryable<Project> query = _context.Projects.Include(p => p.ProjectLicenseTypes);

        if (userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin"))
        {
            // Return all projects for Admin/SuperAdmin
        }
        else if (userRoles.Contains("Client"))
        {
            query = query.Where(p => p.ClientId == userId);
        }
        else if (userRoles.Contains("Provider"))
        {
            var specialist = await _context.Specialists
                .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
            
            if (specialist == null)
                return Enumerable.Empty<ProjectDto>();
            
            var assignedProjectIds = await _context.ProjectSpecialists
                .Where(ps => ps.SpecialistId == specialist.Id)
                .Select(ps => ps.ProjectId)
                .ToListAsync(cancellationToken);
            
            query = query.Where(p => assignedProjectIds.Contains(p.Id));
        }
        else
        {
            _logger.LogWarning("User {UserId} has no recognized role, returning empty list", userId);
            return Enumerable.Empty<ProjectDto>();
        }

        var projects = await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                Project = p,
                LicenseTypeIds = p.ProjectLicenseTypes.Select(plt => plt.LicenseTypeId).ToArray()
            })
            .ToListAsync(cancellationToken);

        return projects.Select(p =>
        {
            string? thumbnailPresignedUrl = null;
            if (!string.IsNullOrEmpty(p.Project.ThumbnailUrl))
            {
                thumbnailPresignedUrl = _fileStorageService.GetPresignedUrl(p.Project.ThumbnailUrl);
            }

            return new ProjectDto
            {
                Id = p.Project.Id,
                Name = p.Project.Name,
                Description = p.Project.Description,
                Status = p.Project.Status.ToString(),
                CreatedAt = p.Project.CreatedAt,
                ThumbnailUrl = thumbnailPresignedUrl,
                StreetAddress = p.Project.StreetAddress,
                City = p.Project.City,
                State = p.Project.State,
                ZipCode = p.Project.ZipCode,
                ProjectScope = (int)p.Project.ProjectScope,
                ManagementType = p.Project.ManagementType.ToString(),
                LicenseTypeIds = p.LicenseTypeIds
            };
        });
    }

    public async Task UpdateProjectStatusAsync(
        int projectId, 
        string status,
        CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            _logger.LogWarning("Attempt to update status for non-existent project {ProjectId}", projectId);
            throw new ProjectNotFoundException(projectId);
        }
        
        if (!Enum.TryParse<ProjectStatus>(status, ignoreCase: true, out var newStatus))
        {
            _logger.LogWarning("Invalid status '{Status}' provided for project {ProjectId}", status, projectId);
            throw new InvalidProjectStatusException(status);
        }
        
        project.Status = newStatus;
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectSpecialistDto>> GetProjectSpecialistsAsync(
        int projectId,
        string userId,
        string[] userRoles,
        CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);

        if (project == null)
        {
            throw new ProjectNotFoundException(projectId);
        }

        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");
        var isClient = userRoles.Contains("Client");

        if (isClient && project.ManagementType == ProjectManagementType.DigitalEngineersManaged)
        {
            return [];
        }

        var specialists = new List<ProjectSpecialistDto>();

        var assignedSpecialists = await _context.ProjectSpecialists
            .AsNoTracking()
            .Where(ps => ps.ProjectId == projectId)
            .Include(ps => ps.Specialist)
                .ThenInclude(s => s.User)
            .Include(ps => ps.Specialist)
                .ThenInclude(s => s.LicenseTypes)
                    .ThenInclude(slt => slt.LicenseType)
                        .ThenInclude(lt => lt.Profession)
            .Select(ps => new ProjectSpecialistDto
            {
                SpecialistId = ps.SpecialistId,
                UserId = ps.Specialist.UserId,
                Name = $"{ps.Specialist.User.FirstName ?? ""} {ps.Specialist.User.LastName ?? ""}".Trim(),
                ProfilePictureUrl = ps.Specialist.User.ProfilePictureUrl,
                IsAssigned = true,
                AssignedOrBidSentAt = ps.AssignedAt,
                LicenseTypes = ps.Specialist.LicenseTypes.Select(slt => new SpecialistLicenseInfoDto
                {
                    LicenseTypeId = slt.LicenseTypeId,
                    LicenseTypeName = slt.LicenseType.Name,
                    ProfessionId = slt.LicenseType.ProfessionId,
                    ProfessionName = slt.LicenseType.Profession.Name
                }).ToArray()
            })
            .ToListAsync(cancellationToken);

        specialists.AddRange(assignedSpecialists);

        if (isAdmin)
        {
            var assignedSpecialistIds = assignedSpecialists.Select(s => s.SpecialistId).ToHashSet();

            var pendingBidSpecialists = await _context.BidRequests
                .AsNoTracking()
                .Where(br => br.ProjectId == projectId && br.Status == BidRequestStatus.Pending)
                .Include(br => br.Specialist)
                    .ThenInclude(s => s.User)
                .Include(br => br.Specialist)
                    .ThenInclude(s => s.LicenseTypes)
                        .ThenInclude(slt => slt.LicenseType)
                            .ThenInclude(lt => lt.Profession)
                .Select(br => new
                {
                    SpecialistId = br.SpecialistId,
                    UserId = br.Specialist.UserId,
                    FirstName = br.Specialist.User.FirstName,
                    LastName = br.Specialist.User.LastName,
                    ProfilePictureUrl = br.Specialist.User.ProfilePictureUrl,
                    SentAt = br.CreatedAt,
                    LicenseTypes = br.Specialist.LicenseTypes.Select(slt => new SpecialistLicenseInfoDto
                    {
                        LicenseTypeId = slt.LicenseTypeId,
                        LicenseTypeName = slt.LicenseType.Name,
                        ProfessionId = slt.LicenseType.ProfessionId,
                        ProfessionName = slt.LicenseType.Profession.Name
                    }).ToArray()
                })
                .Where(x => !assignedSpecialistIds.Contains(x.SpecialistId))
                .ToListAsync(cancellationToken);

            var pendingMembers = pendingBidSpecialists.Select(pbs => new ProjectSpecialistDto
            {
                SpecialistId = pbs.SpecialistId,
                UserId = pbs.UserId,
                Name = $"{pbs.FirstName ?? ""} {pbs.LastName ?? ""}".Trim(),
                ProfilePictureUrl = pbs.ProfilePictureUrl,
                IsAssigned = false,
                AssignedOrBidSentAt = pbs.SentAt,
                LicenseTypes = pbs.LicenseTypes
            });

            specialists.AddRange(pendingMembers);
        }

        return specialists.OrderByDescending(s => s.IsAssigned)
                         .ThenByDescending(s => s.AssignedOrBidSentAt);
    }
}
