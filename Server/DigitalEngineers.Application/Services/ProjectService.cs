using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
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
        _logger.LogInformation("Creating project '{Name}' for client {ClientId}", dto.Name, clientId);

        // Validate ClientId exists
        var clientExists = await _context.Users.AnyAsync(u => u.Id == clientId, cancellationToken);
        if (!clientExists)
        {
            _logger.LogWarning("Client with ID {ClientId} not found", clientId);
            throw new ArgumentException($"Client with ID {clientId} not found", nameof(clientId));
        }

        // Validate LicenseTypeIds exist
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

        // Validate project scope
        if (!Enum.IsDefined(typeof(ProjectScope), dto.ProjectScope))
        {
            _logger.LogWarning("Invalid project scope: {ProjectScope}", dto.ProjectScope);
            throw new ArgumentException($"Invalid project scope: {dto.ProjectScope}", nameof(dto.ProjectScope));
        }

        // Track uploaded S3 keys for rollback
        var uploadedS3Keys = new List<string>();

        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Create project entity
            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                Status = ProjectStatus.New,
                ClientId = clientId,
                StreetAddress = dto.StreetAddress,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                ProjectScope = (ProjectScope)dto.ProjectScope,
                DocumentUrls = dto.DocumentUrls.ToList(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Add project to context
            _context.Projects.Add(project);
            await _context.SaveChangesAsync(cancellationToken);

            // Upload thumbnail if provided
            if (thumbnail != null)
            {
                _logger.LogInformation("Uploading thumbnail for project {ProjectId}", project.Id);
                try
                {
                    var thumbnailKey = await _fileStorageService.UploadFileAsync(
                        thumbnail.FileStream,
                        $"thumbnail_{thumbnail.FileName}",
                        thumbnail.ContentType,
                        project.Id,
                        cancellationToken);
                    
                    project.ThumbnailUrl = thumbnailKey; // Store S3 key instead of full URL
                    uploadedS3Keys.Add(thumbnailKey);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to upload thumbnail for project {ProjectId}", project.Id);
                    throw;
                }
            }

            // Upload files if provided
            if (files != null && files.Count > 0)
            {
                _logger.LogInformation("Uploading {FileCount} files for project {ProjectId}", files.Count, project.Id);
                
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
                            FileUrl = fileKey, // Store S3 key instead of full URL
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

            // Create license type associations
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

            _logger.LogInformation("Project {ProjectId} created successfully with {FileCount} files", 
                project.Id, files?.Count ?? 0);

            return new ProjectDto(
                project.Id,
                project.Name,
                project.Description,
                project.Status.ToString(),
                project.CreatedAt
            );
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error creating project '{Name}' for client {ClientId}. Rolling back transaction and cleaning up uploaded files.", 
                dto.Name, clientId);

            // Cleanup uploaded files from S3
            if (uploadedS3Keys.Count > 0)
            {
                _logger.LogWarning("Cleaning up {FileCount} uploaded files from S3", uploadedS3Keys.Count);
                
                foreach (var s3Key in uploadedS3Keys)
                {
                    try
                    {
                        await _fileStorageService.DeleteFileAsync(s3Key, cancellationToken);
                        _logger.LogInformation("Deleted file from S3: {S3Key}", s3Key);
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

    public async Task<ProjectDetailsDto?> GetProjectByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.ProjectLicenseTypes)
            .Include(p => p.Files)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (project == null)
        {
            return null;
        }

        var licenseTypeIds = project.ProjectLicenseTypes
            .Select(plt => plt.LicenseTypeId)
            .ToArray();

        // Generate presigned URLs for thumbnail
        string? thumbnailPresignedUrl = null;
        if (!string.IsNullOrEmpty(project.ThumbnailUrl))
        {
            thumbnailPresignedUrl = _fileStorageService.GetPresignedUrl(project.ThumbnailUrl);
        }

        // Generate presigned URLs for project files
        var filesWithPresignedUrls = project.Files
            .Select(pf => new ProjectFileDto(
                pf.Id,
                pf.FileName,
                _fileStorageService.GetPresignedUrl(pf.FileUrl), // Generate presigned URL
                pf.FileSize,
                pf.ContentType,
                pf.UploadedAt
            ))
            .ToArray();

        return new ProjectDetailsDto(
            project.Id,
            project.Name,
            project.Description,
            project.Status.ToString(),
            project.ClientId,
            project.StreetAddress,
            project.City,
            project.State,
            project.ZipCode,
            (int)project.ProjectScope,
            project.DocumentUrls.ToArray(),
            licenseTypeIds,
            project.CreatedAt,
            project.UpdatedAt,
            thumbnailPresignedUrl,
            filesWithPresignedUrls
        );
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsByClientIdAsync(string clientId, CancellationToken cancellationToken = default)
    {
        var projects = await _context.Projects
            .Where(p => p.ClientId == clientId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProjectDto(
                p.Id,
                p.Name,
                p.Description,
                p.Status.ToString(),
                p.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return projects;
    }
}
