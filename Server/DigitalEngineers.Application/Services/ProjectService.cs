using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.DTOs.ProjectComment;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<ProjectService> _logger;
    private readonly IEmailService _emailService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly INotificationService _notificationService;
    private readonly IUrlProvider _urlProvider;

    public ProjectService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        ILogger<ProjectService> logger,
        IEmailService emailService,
        UserManager<ApplicationUser> userManager,
        INotificationService notificationService,
        IUrlProvider urlProvider)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _logger = logger;
        _emailService = emailService;
        _userManager = userManager;
        _notificationService = notificationService;
        _urlProvider = urlProvider;
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

        // Validate profession types
        if (dto.ProfessionTypeIds.Length == 0)
        {
            throw new ArgumentException("At least one ProfessionTypeId must be provided", nameof(dto.ProfessionTypeIds));
        }

        // Validate profession types exist
        var existingProfessionTypeIds = await _context.ProfessionTypes
            .Where(pt => dto.ProfessionTypeIds.Contains(pt.Id))
            .Select(pt => pt.Id)
            .ToListAsync(cancellationToken);

        if (existingProfessionTypeIds.Count != dto.ProfessionTypeIds.Length)
        {
            var invalidIds = dto.ProfessionTypeIds.Except(existingProfessionTypeIds);
            _logger.LogWarning("Invalid profession type IDs: {InvalidIds}", string.Join(", ", invalidIds));
            throw new ArgumentException($"Invalid profession type IDs: {string.Join(", ", invalidIds)}", nameof(dto.ProfessionTypeIds));
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
                // Set status based on management type
                Status = dto.ManagementType == ProjectManagementType.ClientManaged 
                    ? ProjectStatus.InProgress 
                    : ProjectStatus.QuotePending,
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

            // Create default task statuses
            var defaultStatuses = new List<ProjectTaskStatus>
            {
                new ProjectTaskStatus
                {
                    Name = "Todo",
                    Color = "#6c757d",
                    Order = 1,
                    IsDefault = true,
                    IsCompleted = false,
                    ProjectId = project.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new ProjectTaskStatus
                {
                    Name = "In Progress",
                    Color = "#007bff",
                    Order = 2,
                    IsDefault = false,
                    IsCompleted = false,
                    ProjectId = project.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new ProjectTaskStatus
                {
                    Name = "Done",
                    Color = "#28a745",
                    Order = 3,
                    IsDefault = false,
                    IsCompleted = true,
                    ProjectId = project.Id,
                    CreatedAt = DateTime.UtcNow
                }
            };
            
            _context.Set<ProjectTaskStatus>().AddRange(defaultStatuses);

            // Create default task labels
            var defaultLabels = new List<ProjectTaskLabel>
            {
                new ProjectTaskLabel
                {
                    Name = "Bug",
                    Color = "#dc3545",
                    ProjectId = project.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new ProjectTaskLabel
                {
                    Name = "Feature",
                    Color = "#28a745",
                    ProjectId = project.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new ProjectTaskLabel
                {
                    Name = "Enhancement",
                    Color = "#17a2b8",
                    ProjectId = project.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new ProjectTaskLabel
                {
                    Name = "Documentation",
                    Color = "#6610f2",
                    ProjectId = project.Id,
                    CreatedAt = DateTime.UtcNow
                }
            };
            
            _context.Set<ProjectTaskLabel>().AddRange(defaultLabels);
            await _context.SaveChangesAsync(cancellationToken);

            if (thumbnail != null)
            {
                try
                {
                    var thumbnailKey = await _fileStorageService.UploadProjectThumbnailAsync(
                        thumbnail.FileStream,
                        thumbnail.FileName,
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
                        var fileKey = await _fileStorageService.UploadProjectFileAsync(
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

            // Save ProjectProfessionTypes (selected profession types for project)
            var projectProfessionTypes = dto.ProfessionTypeIds
                .Select(ptId => new ProjectProfessionType
                {
                    ProjectId = project.Id,
                    ProfessionTypeId = ptId
                })
                .ToList();

            _context.ProjectProfessionTypes.AddRange(projectProfessionTypes);
            await _context.SaveChangesAsync(cancellationToken);

            //await transaction.CommitAsync(cancellationToken);

            var client = await _context.Users
                .Where(u => u.Id == clientId)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.ProfilePictureUrl
                })
                .FirstOrDefaultAsync(cancellationToken);

            string? clientName = null;
            string? clientProfilePictureUrl = null;
            
            if (client != null)
            {
                clientName = string.IsNullOrWhiteSpace(client.FirstName) && string.IsNullOrWhiteSpace(client.LastName)
                    ? client.Email
                    : $"{client.FirstName ?? ""} {client.LastName ?? ""}".Trim();
                clientProfilePictureUrl = client.ProfilePictureUrl;
            }

            // NEW: Send different notifications based on management type
            var notificationBody = dto.ManagementType == ProjectManagementType.ClientManaged
                ? $"Your project '{project.Name}' is ready to use. You can invite specialists and manage tasks."
                : $"Your project '{project.Name}' has been successfully created and is awaiting a quote.";

            // Send push notification to client
            await _notificationService.SendPushNotificationAsync(
                receiverUserId: clientId,
                type: NotificationType.Project,
                subType: NotificationSubType.Created,
                title: "Project Created",
                body: notificationBody,
                additionalData: new Dictionary<string, string>
                {
                    { "projectId", project.Id.ToString() },
                    { "projectName", project.Name }
                },
                cancellationToken: cancellationToken);

            // Send push notifications to all admins
            var admins = await GetAllAdminsAsync(cancellationToken);
            var adminNotificationBody = dto.ManagementType == ProjectManagementType.ClientManaged
                ? $"New self-managed project '{project.Name}' created by {clientName}"
                : $"New project '{project.Name}' created by {clientName} - pending quote";

            foreach (var admin in admins)
            {
                await _notificationService.SendPushNotificationAsync(
                    receiverUserId: admin.Id,
                    type: NotificationType.Project,
                    subType: NotificationSubType.Created,
                    title: "New Project Created",
                    body: adminNotificationBody,
                    additionalData: new Dictionary<string, string>
                    {
                        { "projectId", project.Id.ToString() },
                        { "projectName", project.Name },
                        { "clientId", clientId },
                        { "clientName", clientName ?? "" },
                        { "managementType", dto.ManagementType.ToString() }
                    },
                    cancellationToken: cancellationToken);
            }

            string? thumbnailPresignedUrl = null;
            if (!string.IsNullOrEmpty(project.ThumbnailUrl))
            {
                thumbnailPresignedUrl = _fileStorageService.GetPresignedUrl(project.ThumbnailUrl);
            }

            await transaction.CommitAsync(cancellationToken);

            // NEW: Send different email based on management type
            if (dto.ManagementType == ProjectManagementType.ClientManaged)
            {
                await _emailService.SendClientManagedProjectCreatedNotificationAsync(
                    client!.Email!,
                    clientName!,
                    project.Name,
                    project.Description,
                    $"{project.StreetAddress}, {project.City}, {project.State}",
                    cancellationToken);
            }
            else
            {
                await _emailService.SendProjectCreatedNotificationAsync(
                    client!.Email!,
                    clientName!,
                    project.Name,
                    project.Description,
                    $"{project.StreetAddress}, {project.City}, {project.State}",
                    cancellationToken);
            }

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Status = project.Status.ToString(),
                ClientId = clientId,
                ClientName = clientName,
                ClientProfilePictureUrl = clientProfilePictureUrl,
                CreatedAt = project.CreatedAt,
                ThumbnailUrl = thumbnailPresignedUrl,
                StreetAddress = project.StreetAddress,
                City = project.City,
                State = project.State,
                ZipCode = project.ZipCode,
                ProjectScope = (int)project.ProjectScope,
                ManagementType = project.ManagementType.ToString(),
                LicenseTypeIds = [], // Computed dynamically when needed
                QuotedAmount = project.QuotedAmount,
                TaskCount = 0
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
            .Include(p => p.ProjectProfessionTypes)
                .ThenInclude(ppt => ppt.ProfessionType)
                    .ThenInclude(pt => pt.Profession)
            .Include(p => p.ProjectProfessionTypes)
                .ThenInclude(ppt => ppt.ProfessionType)
                    .ThenInclude(pt => pt.LicenseRequirements)
                        .ThenInclude(lr => lr.LicenseType)
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

        // Get profession types from ProjectProfessionTypes
        var professionTypes = project.ProjectProfessionTypes
            .Select(ppt => new ProfessionTypeDto
            {
                Id = ppt.ProfessionType.Id,
                Name = ppt.ProfessionType.Name,
                Code = ppt.ProfessionType.Code,
                Description = ppt.ProfessionType.Description,
                ProfessionId = ppt.ProfessionType.ProfessionId,
                ProfessionName = ppt.ProfessionType.Profession.Name,
                ProfessionCode = ppt.ProfessionType.Profession.Code,
                RequiresStateLicense = ppt.ProfessionType.RequiresStateLicense,
                DisplayOrder = ppt.ProfessionType.DisplayOrder,
                IsActive = ppt.ProfessionType.IsActive,
                LicenseRequirementsCount = ppt.ProfessionType.LicenseRequirements.Count
            })
            .ToArray();

        var professionTypeIds = professionTypes.Select(pt => pt.Id).ToArray();

        // Extract unique professions from profession types
        var professions = professionTypes
            .GroupBy(pt => pt.ProfessionId)
            .Select(g => g.First())
            .Select(pt => new ProfessionDto
            {
                Id = pt.ProfessionId,
                Name = pt.ProfessionName,
                Code = pt.ProfessionCode,
                Description = "",
                ProfessionTypesCount = professionTypes.Count(x => x.ProfessionId == pt.ProfessionId)
            })
            .ToArray();

        // Compute license types from profession types' requirements
        var licenseTypes = project.ProjectProfessionTypes
            .SelectMany(ppt => ppt.ProfessionType.LicenseRequirements
                .Select(lr => lr.LicenseType))
            .GroupBy(lt => lt.Id)
            .Select(g => g.First())
            .Select(lt => new LicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Code = lt.Code,
                Description = lt.Description,
                IsStateSpecific = lt.IsStateSpecific
            })
            .ToArray();

        var licenseTypeIds = licenseTypes.Select(lt => lt.Id).ToArray();

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
            ProfessionTypeIds = professionTypeIds,
            Professions = professions,
            ProfessionTypes = professionTypes,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            ThumbnailUrl = thumbnailPresignedUrl,
            Files = filesWithPresignedUrls,
            QuotedAmount = project.QuotedAmount,
            QuoteSubmittedAt = project.QuoteSubmittedAt,
            QuoteAcceptedAt = project.QuoteAcceptedAt,
            QuoteRejectedAt = project.QuoteRejectedAt,
            QuoteNotes = project.QuoteNotes
        };
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsAsync(
        string userId, 
        string[] userRoles,
        string[]? statuses = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Project> query = _context.Projects
            .Include(p => p.Client);

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

        // Apply optional filters
        if (statuses != null && statuses.Length > 0)
        {
            var parsedStatuses = statuses
                .Where(s => Enum.TryParse<ProjectStatus>(s, true, out _))
                .Select(s => Enum.Parse<ProjectStatus>(s, true))
                .ToList();
            
            if (parsedStatuses.Count > 0)
            {
                query = query.Where(p => parsedStatuses.Contains(p.Status));
            }
        }

        if (dateFrom.HasValue)
        {
            // Convert to UTC if Kind is Unspecified or Local
            var dateFromUtc = dateFrom.Value.Kind == DateTimeKind.Utc 
                ? dateFrom.Value 
                : DateTime.SpecifyKind(dateFrom.Value, DateTimeKind.Utc);
            
            query = query.Where(p => p.CreatedAt >= dateFromUtc);
        }

        if (dateTo.HasValue)
        {
            // Convert to UTC if Kind is Unspecified or Local
            var dateToUtc = dateTo.Value.Kind == DateTimeKind.Utc 
                ? dateTo.Value 
                : DateTime.SpecifyKind(dateTo.Value, DateTimeKind.Utc);
            
            var endOfDay = dateToUtc.Date.AddDays(1).AddTicks(-1);
            query = query.Where(p => p.CreatedAt <= endOfDay);
        }

        // Server-side search filter (project name, description, address, client name/email)
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => 
                p.Name.ToLower().Contains(searchLower) ||
                p.Description.ToLower().Contains(searchLower) ||
                p.StreetAddress.ToLower().Contains(searchLower) ||
                p.City.ToLower().Contains(searchLower) ||
                p.State.ToLower().Contains(searchLower) ||
                (p.Client != null && (
                    (p.Client.FirstName != null && p.Client.FirstName.ToLower().Contains(searchLower)) ||
                    (p.Client.LastName != null && p.Client.LastName.ToLower().Contains(searchLower)) ||
                    (p.Client.Email != null && p.Client.Email.ToLower().Contains(searchLower))
                ))
            );
        }

        var projects = await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                Project = p,
                ClientName = p.Client != null 
                    ? (string.IsNullOrWhiteSpace(p.Client.FirstName) && string.IsNullOrWhiteSpace(p.Client.LastName)
                        ? p.Client.Email
                        : $"{p.Client.FirstName ?? ""} {p.Client.LastName ?? ""}".Trim())
                    : null,
                ClientProfilePictureUrl = p.Client != null ? p.Client.ProfilePictureUrl : null,
                TaskCount = _context.Tasks.Count(t => t.ProjectId == p.Id)
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
                ClientId = p.Project.ClientId,
                ClientName = p.ClientName,
                ClientProfilePictureUrl = p.ClientProfilePictureUrl,
                CreatedAt = p.Project.CreatedAt,
                ThumbnailUrl = thumbnailPresignedUrl,
                StreetAddress = p.Project.StreetAddress,
                City = p.Project.City,
                State = p.Project.State,
                ZipCode = p.Project.ZipCode,
                ProjectScope = (int)p.Project.ProjectScope,
                ManagementType = p.Project.ManagementType.ToString(),
                LicenseTypeIds = [], // Computed dynamically from ProjectProfessionTypes when needed
                QuotedAmount = p.Project.QuotedAmount,
                TaskCount = p.TaskCount
            };
        });
    }

    public async Task UpdateProjectStatusAsync(
        int projectId, 
        string status,
        string userId,
        string[] userRoles,
        CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            _logger.LogWarning("Attempt to update status for non-existent project {ProjectId}", projectId);
            throw new ProjectNotFoundException(projectId);
        }

        // Authorization check
        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");
        var isClient = userRoles.Contains("Client");
        
        if (!isAdmin)
        {
            if (!isClient || project.ClientId != userId || project.ManagementType != ProjectManagementType.ClientManaged)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this project status");
            }
        }
        
        if (!Enum.TryParse<ProjectStatus>(status, ignoreCase: true, out var newStatus))
        {
            _logger.LogWarning("Invalid status '{Status}' provided for project {ProjectId}", status, projectId);
            throw new InvalidProjectStatusException(status);
        }
        
        var oldStatus = project.Status.ToString();
        project.Status = newStatus;
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);

        // Send status changed email to client
        var clientName = $"{project.Client.FirstName} {project.Client.LastName}";
        await _emailService.SendProjectStatusChangedNotificationAsync(
            project.Client.Email!,
            clientName,
            project.Name,
            oldStatus,
            newStatus.ToString(),
            cancellationToken);

        // Send push notifications to all admins
        var admins = await GetAllAdminsAsync(cancellationToken);
        foreach (var admin in admins)
        {
            await _notificationService.SendPushNotificationAsync(
                receiverUserId: admin.Id,
                type: NotificationType.Project,
                subType: NotificationSubType.StatusChanged,
                title: "Project Status Changed",
                body: $"Project '{project.Name}' status changed from {oldStatus} to {newStatus}",
                additionalData: new Dictionary<string, string>
                {
                    { "projectId", project.Id.ToString() },
                    { "projectName", project.Name },
                    { "oldStatus", oldStatus },
                    { "newStatus", newStatus.ToString() },
                    { "clientName", clientName }
                },
                cancellationToken: cancellationToken);
        }

        // Send push notification to client
        await _notificationService.SendPushNotificationAsync(
            receiverUserId: project.ClientId,
            type: NotificationType.Project,
            subType: NotificationSubType.StatusChanged,
            title: "Project Status Changed",
            body: $"Your project '{project.Name}' status changed to {newStatus}",
            additionalData: new Dictionary<string, string>
            {
                { "projectId", project.Id.ToString() },
                { "projectName", project.Name },
                { "newStatus", newStatus.ToString() }
            },
            cancellationToken: cancellationToken);
    }

    public async Task UpdateProjectManagementTypeAsync(
        int projectId,
        string managementType,
        string userId,
        string[] userRoles,
        CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            _logger.LogWarning("Attempt to update management type for non-existent project {ProjectId}", projectId);
            throw new ProjectNotFoundException(projectId);
        }

        // Authorization check
        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");
        var isClient = userRoles.Contains("Client");
        
        if (!isAdmin)
        {
            if (!isClient || project.ClientId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this project management type");
            }
        }
        
        if (!Enum.TryParse<ProjectManagementType>(managementType, ignoreCase: true, out var newManagementType))
        {
            _logger.LogWarning("Invalid management type '{ManagementType}' provided for project {ProjectId}", managementType, projectId);
            throw new ArgumentException($"Invalid management type: {managementType}", nameof(managementType));
        }
        
        project.ManagementType = newManagementType;
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);

        // Send push notifications to all admins
        var admins = await GetAllAdminsAsync(cancellationToken);
        var client = await _context.Users.FindAsync(new object[] { project.ClientId }, cancellationToken);
        var clientName = client != null 
            ? $"{client.FirstName ?? ""} {client.LastName ?? ""}".Trim() 
            : "Unknown";

        foreach (var admin in admins)
        {
            await _notificationService.SendPushNotificationAsync(
                receiverUserId: admin.Id,
                type: NotificationType.Project,
                subType: NotificationSubType.StatusChanged,
                title: "Project Management Type Changed",
                body: $"Project '{project.Name}' management type changed to {newManagementType}",
                additionalData: new Dictionary<string, string>
                {
                    { "projectId", project.Id.ToString() },
                    { "projectName", project.Name },
                    { "managementType", newManagementType.ToString() },
                    { "clientName", clientName }
                },
                cancellationToken: cancellationToken);
        }
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

        // For DigitalEngineersManaged projects, hide specialists from clients
        if (isClient && project.ManagementType == ProjectManagementType.DigitalEngineersManaged)
        {
            // Show anonymized specialists (DE avatars)
            var assignedCount = await _context.ProjectSpecialists
                .AsNoTracking()
                .Where(ps => ps.ProjectId == projectId)
                .Include(ps => ps.Specialist)
                    .ThenInclude(s => s.LicenseTypes)
                        .ThenInclude(slt => slt.LicenseType)
                .Select(ps => new
                {
                    ps.Role,
                    AssignedAt = ps.AssignedAt,
                    LicenseTypes = ps.Specialist.LicenseTypes.Select(slt => new SpecialistLicenseInfoDto
                    {
                        LicenseTypeId = slt.LicenseTypeId,
                        LicenseTypeName = slt.LicenseType.Name,
                        LicenseTypeCode = slt.LicenseType.Code,
                        IsStateSpecific = slt.LicenseType.IsStateSpecific
                    }).ToArray()
                })
                .ToListAsync(cancellationToken);

            return assignedCount.Select((spec, index) => new ProjectSpecialistDto
            {
                SpecialistId = index + 1, // Anonymous ID
                UserId = string.Empty,
                Name = "Novobid Specialist",
                ProfilePictureUrl = null,
                Role = spec.Role,
                IsAssigned = true,
                IsAnonymized = true,
                AssignedOrBidSentAt = spec.AssignedAt,
                LicenseTypes = spec.LicenseTypes
            });
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
            .Select(ps => new ProjectSpecialistDto
            {
                SpecialistId = ps.SpecialistId,
                UserId = ps.Specialist.UserId,
                Name = $"{ps.Specialist.User.FirstName ?? ""} {ps.Specialist.User.LastName ?? ""}".Trim(),
                ProfilePictureUrl = ps.Specialist.User.ProfilePictureUrl,
                Role = ps.Role,
                IsAssigned = true,
                IsAnonymized = false,
                AssignedOrBidSentAt = ps.AssignedAt,
                LicenseTypes = ps.Specialist.LicenseTypes.Select(slt => new SpecialistLicenseInfoDto
                {
                    LicenseTypeId = slt.LicenseTypeId,
                    LicenseTypeName = slt.LicenseType.Name,
                    LicenseTypeCode = slt.LicenseType.Code,
                    IsStateSpecific = slt.LicenseType.IsStateSpecific
                }).ToArray()
            })
            .ToListAsync(cancellationToken);

        specialists.AddRange(assignedSpecialists);

        // Show pending bids for Admin OR Client with ClientManaged project
        if (isAdmin || (isClient && project.ManagementType == ProjectManagementType.ClientManaged))
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
                        LicenseTypeCode = slt.LicenseType.Code,
                        IsStateSpecific = slt.LicenseType.IsStateSpecific
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
                IsAnonymized = false,
                AssignedOrBidSentAt = pbs.SentAt,
                LicenseTypes = pbs.LicenseTypes
            });

            specialists.AddRange(pendingMembers);
        }

        return specialists.OrderByDescending(s => s.IsAssigned)
                         .ThenByDescending(s => s.AssignedOrBidSentAt);
    }

    public async Task<ProjectQuoteDto> GetProjectQuoteDataAsync(int projectId, string? userId, string[] userRoles, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(projectId);
        }
        
        // Authorization check: Admin/SuperAdmin can access all, Client can only access their ClientManaged projects
        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");
        var isClient = userRoles.Contains("Client");
        
        if (!isAdmin)
        {
            if (!isClient || project.ClientId != userId || project.ManagementType != ProjectManagementType.ClientManaged)
            {
                throw new UnauthorizedAccessException("You are not authorized to access quote data for this project");
            }
        }
        
        var acceptedBids = await _context.BidResponses
            .AsNoTracking()
            .Include(br => br.Specialist)
                .ThenInclude(s => s.User)
            .Include(br => br.BidRequest)
            .Where(br => br.BidRequest.ProjectId == projectId && br.AdminMarkupPercentage != null)
            .Select(br => new
            {
                BidResponse = br,
                SpecialistName = $"{br.Specialist.User.FirstName ?? ""} {br.Specialist.User.LastName ?? ""}".Trim(),
                Role = br.BidRequest.Title
            })
            .ToListAsync(cancellationToken);
        
        // Allow empty accepted bids - admin can create quote using own resources
        var acceptedBidSummaries = acceptedBids.Select(ab =>
        {
            var markup = ab.BidResponse.AdminMarkupPercentage!.Value;
            var finalPrice = ab.BidResponse.ProposedPrice * (1 + markup / 100);
            
            return new AcceptedBidSummaryDto
            {
                BidResponseId = ab.BidResponse.Id,
                SpecialistName = ab.SpecialistName,
                Role = ab.Role,
                ProposedPrice = ab.BidResponse.ProposedPrice,
                AdminMarkupPercentage = markup,
                FinalPrice = finalPrice
            };
        }).ToArray();
        
        var suggestedAmount = acceptedBidSummaries.Sum(ab => ab.FinalPrice);
        
        return new ProjectQuoteDto
        {
            ProjectId = project.Id,
            ProjectName = project.Name,
            AcceptedBids = acceptedBidSummaries,
            SuggestedAmount = suggestedAmount,
            QuotedAmount = project.QuotedAmount,
            QuoteNotes = project.QuoteNotes,
            QuoteSubmittedAt = project.QuoteSubmittedAt
        };
    }
    
    public async Task SubmitQuoteToClientAsync(CreateQuoteDto dto, string? userId, string[] userRoles, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Id == dto.ProjectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(dto.ProjectId);
        }
        
        // Authorization check: Admin/SuperAdmin can submit for all, Client can only submit for their ClientManaged projects
        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");
        var isClient = userRoles.Contains("Client");
        
        if (!isAdmin)
        {
            if (!isClient || project.ClientId != userId || project.ManagementType != ProjectManagementType.ClientManaged)
            {
                throw new UnauthorizedAccessException("You are not authorized to submit quote for this project");
            }
        }
        
        // For ClientManaged projects, status should be InProgress (not QuotePending)
        if (project.ManagementType == ProjectManagementType.ClientManaged)
        {
            if (project.Status != ProjectStatus.InProgress)
            {
                throw new InvalidProjectStatusForQuoteException(
                    dto.ProjectId, 
                    project.Status.ToString(), 
                    "set project price");
            }
        }
        else
        {
            if (project.Status != ProjectStatus.QuotePending && project.Status != ProjectStatus.QuoteRejected)
            {
                throw new InvalidProjectStatusForQuoteException(
                    dto.ProjectId, 
                    project.Status.ToString(), 
                    "submit quote");
            }
        }
        
        project.QuotedAmount = dto.QuotedAmount;
        project.QuoteNotes = dto.QuoteNotes;
        project.QuoteSubmittedAt = DateTime.UtcNow;
        
        // For ClientManaged: keep status as InProgress, for DigitalEngineersManaged: change to QuoteSubmitted
        if (project.ManagementType == ProjectManagementType.DigitalEngineersManaged)
        {
            project.Status = ProjectStatus.QuoteSubmitted;
        }
        
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);

        // Send quote submitted email only for DigitalEngineersManaged projects
        if (project.ManagementType == ProjectManagementType.DigitalEngineersManaged)
        {
            var clientName = $"{project.Client.FirstName} {project.Client.LastName}";
            var baseUrl = _urlProvider.GetBaseUrl();
            var quoteUrl = $"{baseUrl}/client/projects/{project.Id}";
            
            await _emailService.SendQuoteSubmittedNotificationAsync(
                project.Client.Email!,
                clientName,
                project.Name,
                dto.QuotedAmount,
                dto.QuoteNotes,
                quoteUrl,
                cancellationToken);
        }
    }
    
    public async Task UpdateQuoteAsync(CreateQuoteDto dto, string? userId, string[] userRoles, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == dto.ProjectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(dto.ProjectId);
        }
        
        // Authorization check: Admin/SuperAdmin can update all, Client can only update their ClientManaged projects
        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");
        var isClient = userRoles.Contains("Client");
        
        if (!isAdmin)
        {
            if (!isClient || project.ClientId != userId || project.ManagementType != ProjectManagementType.ClientManaged)
            {
                throw new UnauthorizedAccessException("You are not authorized to update quote for this project");
            }
        }
        
        // For ClientManaged: allow update in InProgress, for DigitalEngineersManaged: only in QuoteSubmitted
        if (project.ManagementType == ProjectManagementType.ClientManaged)
        {
            if (project.Status != ProjectStatus.InProgress)
            {
                throw new InvalidProjectStatusForQuoteException(
                    dto.ProjectId, 
                    project.Status.ToString(), 
                    "update project price");
            }
        }
        else
        {
            if (project.Status != ProjectStatus.QuoteSubmitted)
            {
                throw new InvalidProjectStatusForQuoteException(
                    dto.ProjectId, 
                    project.Status.ToString(), 
                    "update quote");
            }
        }
        
        project.QuotedAmount = dto.QuotedAmount;
        project.QuoteNotes = dto.QuoteNotes;
        project.QuoteSubmittedAt = DateTime.UtcNow; // Update submission time
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task AcceptQuoteAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(projectId);
        }
        
        if (project.Status != ProjectStatus.QuoteSubmitted)
        {
            throw new InvalidProjectStatusForQuoteException(
                projectId, 
                project.Status.ToString(), 
                "accept quote");
        }
        
        if (project.QuotedAmount == null)
        {
            _logger.LogWarning("Attempt to accept quote for project {ProjectId} with no quoted amount", projectId);
            throw new InvalidProjectStatusForQuoteException(
                projectId, 
                project.Status.ToString(), 
                "accept quote - no quoted amount");
        }
        
        project.QuoteAcceptedAt = DateTime.UtcNow;
        project.Status = ProjectStatus.QuoteAccepted;
        project.Budget = project.QuotedAmount.Value;
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);

        // Send quote accepted email to all admins
        var admins = await _userManager.GetUsersInRoleAsync("Admin");
        var superAdmins = await _userManager.GetUsersInRoleAsync("SuperAdmin");
        var allAdmins = admins.Union(superAdmins);

        var clientName = $"{project.Client.FirstName} {project.Client.LastName}";

        foreach (var admin in allAdmins)
        {
            await _emailService.SendQuoteAcceptedNotificationAsync(
                admin.Email!,
                $"{admin.FirstName} {admin.LastName}",
                project.Name,
                clientName,
                project.QuotedAmount.Value,
                cancellationToken);
        }
    }
    
    public async Task RejectQuoteAsync(int projectId, string? rejectionReason, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(projectId);
        }
        
        if (project.Status != ProjectStatus.QuoteSubmitted)
        {
            throw new InvalidProjectStatusForQuoteException(
                projectId, 
                project.Status.ToString(), 
                "reject quote");
        }
        
        project.QuoteRejectedAt = DateTime.UtcNow;
        project.Status = ProjectStatus.QuoteRejected;
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);

        // Send quote rejected email to all admins
        var admins = await _userManager.GetUsersInRoleAsync("Admin");
        var superAdmins = await _userManager.GetUsersInRoleAsync("SuperAdmin");
        var allAdmins = admins.Union(superAdmins);

        var clientName = $"{project.Client.FirstName} {project.Client.LastName}";

        foreach (var admin in allAdmins)
        {
            await _emailService.SendQuoteRejectedNotificationAsync(
                admin.Email!,
                $"{admin.FirstName} {admin.LastName}",
                project.Name,
                clientName,
                rejectionReason,
                cancellationToken);
        }
    }
    
    // Comments
    public async Task<IEnumerable<ProjectCommentDto>> GetProjectCommentsAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var commentsData = await _context.ProjectComments
            .AsNoTracking()
            .Where(c => c.ProjectId == projectId)
            .Include(c => c.User)
            .Include(c => c.Replies)
            .Include(c => c.Mentions)
                .ThenInclude(m => m.MentionedUser)
            .Include(c => c.FileReferences) // NEW
                .ThenInclude(cfr => cfr.ProjectFile) // NEW
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.ProjectId,
                c.UserId,
                UserFirstName = c.User.FirstName,
                UserLastName = c.User.LastName,
                UserProfilePictureUrl = c.User.ProfilePictureUrl,
                c.Content,
                c.ParentCommentId,
                c.CreatedAt,
                c.UpdatedAt,
                c.IsEdited,
                RepliesCount = c.Replies.Count,
                Mentions = c.Mentions.Select(m => new
                {
                    m.MentionedUserId,
                    MentionedUserName = $"{m.MentionedUser.FirstName ?? ""} {m.MentionedUser.LastName ?? ""}".Trim()
                }).ToList(),
                // NEW
                FileReferences = c.FileReferences.Select(cfr => new
                {
                    cfr.Id,
                    cfr.ProjectFileId,
                    cfr.ProjectFile.FileName,
                    cfr.ProjectFile.FileUrl,
                    cfr.ProjectFile.FileSize,
                    cfr.ProjectFile.ContentType
                }).ToList()
            })
            .ToListAsync(cancellationToken);
        
        var comments = commentsData.Select(c => new ProjectCommentDto
        {
            Id = c.Id,
            ProjectId = c.ProjectId,
            UserId = c.UserId,
            UserName = $"{c.UserFirstName ?? ""} {c.UserLastName ?? ""}".Trim(),
            UserProfilePictureUrl = !string.IsNullOrEmpty(c.UserProfilePictureUrl) 
                ? _fileStorageService.GetPresignedUrl(c.UserProfilePictureUrl) 
                : null,
            Content = c.Content,
            ParentCommentId = c.ParentCommentId,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            IsEdited = c.IsEdited,
            RepliesCount = c.RepliesCount,
            MentionedUserIds = c.Mentions.Select(m => m.MentionedUserId).ToArray(),
            MentionedUserNames = c.Mentions.Select(m => m.MentionedUserName).ToArray(),
            // NEW: Map file references with presigned URLs
            FileReferences = c.FileReferences.Select(fr => new FileReferenceDto
            {
                Id = fr.Id,
                ProjectFileId = fr.ProjectFileId,
                FileName = fr.FileName,
                FileUrl = _fileStorageService.GetPresignedUrl(fr.FileUrl),
                FileSize = fr.FileSize,
                ContentType = fr.ContentType
            }).ToArray()
        }).ToList();
        
        return comments;
    }
    
    public async Task<ProjectCommentDto> AddCommentAsync(CreateProjectCommentDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == dto.ProjectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(dto.ProjectId);
        }
        
        if (dto.ParentCommentId.HasValue)
        {
            var parentExists = await _context.ProjectComments
                .AnyAsync(c => c.Id == dto.ParentCommentId.Value && c.ProjectId == dto.ProjectId, cancellationToken);
            
            if (!parentExists)
            {
                throw new ArgumentException($"Parent comment with ID {dto.ParentCommentId.Value} not found in project {dto.ProjectId}");
            }
        }
        
        // NEW: Validate file references belong to project
        if (dto.ProjectFileIds.Length > 0)
        {
            var validFileIds = await _context.ProjectFiles
                .Where(pf => pf.ProjectId == dto.ProjectId && dto.ProjectFileIds.Contains(pf.Id))
                .Select(pf => pf.Id)
                .ToListAsync(cancellationToken);
            
            if (validFileIds.Count != dto.ProjectFileIds.Length)
            {
                var invalidIds = dto.ProjectFileIds.Except(validFileIds);
                throw new ArgumentException($"Invalid file IDs for project {dto.ProjectId}: {string.Join(", ", invalidIds)}");
            }
        }
        
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.FirstName,
                u.LastName,
                u.ProfilePictureUrl
            })
            .FirstOrDefaultAsync(cancellationToken);
    
        var comment = new ProjectComment
        {
            ProjectId = dto.ProjectId,
            UserId = userId,
            Content = dto.Content,
            ParentCommentId = dto.ParentCommentId,
            CreatedAt = DateTime.UtcNow,
            IsEdited = false
        };
        
        _context.ProjectComments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);
        
        // NEW: Create file references
        if (dto.ProjectFileIds.Length > 0)
        {
            var fileReferences = dto.ProjectFileIds.Select(fileId => new CommentFileReference
            {
                CommentId = comment.Id,
                ProjectFileId = fileId,
                CreatedAt = DateTime.UtcNow
            }).ToList();
            
            _context.CommentFileReferences.AddRange(fileReferences);
            await _context.SaveChangesAsync(cancellationToken);
        }
        
        // Create mentions
        if (dto.MentionedUserIds.Length > 0)
        {
            var mentions = dto.MentionedUserIds.Select(mentionedUserId => new CommentMention
            {
                CommentId = comment.Id,
                MentionedUserId = mentionedUserId,
                CreatedAt = DateTime.UtcNow
            }).ToList();
            
            _context.CommentMentions.AddRange(mentions);
            await _context.SaveChangesAsync(cancellationToken);
            
            // Send notifications to mentioned users
            var userName = $"{user?.FirstName ?? ""} {user?.LastName ?? ""}".Trim();
            
            // NEW: Check if files are shared
            var hasFileShares = dto.ProjectFileIds.Length > 0;
            
            foreach (var mentionedUserId in dto.MentionedUserIds)
            {
                // Don't send notification to self
                if (mentionedUserId == userId)
                    continue;
                
                // NEW: Use FileShared subtype if files are attached
                var notificationSubType = hasFileShares ? NotificationSubType.FileShared : NotificationSubType.Mentioned;
                var notificationTitle = hasFileShares ? "Files shared with you" : "You were mentioned in a comment";
                var notificationBody = hasFileShares 
                    ? $"{userName} shared {dto.ProjectFileIds.Length} file(s) with you in project '{project.Name}'"
                    : $"{userName} mentioned you in project '{project.Name}'";
                
                await _notificationService.SendPushNotificationAsync(
                    receiverUserId: mentionedUserId,
                    type: NotificationType.Comment,
                    subType: notificationSubType,
                    title: notificationTitle,
                    body: notificationBody,
                    additionalData: new Dictionary<string, string>
                    {
                        { "projectId", dto.ProjectId.ToString() },
                        { "commentId", comment.Id.ToString() },
                        { "hasFiles", hasFileShares.ToString() }
                    },
                    cancellationToken: cancellationToken
                );
            }
        }
        
        // NEW: Load file references for response
        var fileReferenceDtos = Array.Empty<FileReferenceDto>();
        if (dto.ProjectFileIds.Length > 0)
        {
            var fileRefs = await _context.CommentFileReferences
                .Where(cfr => cfr.CommentId == comment.Id)
                .Include(cfr => cfr.ProjectFile)
                .ToListAsync(cancellationToken);
            
            fileReferenceDtos = fileRefs.Select(cfr => new FileReferenceDto
            {
                Id = cfr.Id,
                ProjectFileId = cfr.ProjectFileId,
                FileName = cfr.ProjectFile.FileName,
                FileUrl = _fileStorageService.GetPresignedUrl(cfr.ProjectFile.FileUrl),
                FileSize = cfr.ProjectFile.FileSize,
                ContentType = cfr.ProjectFile.ContentType
            }).ToArray();
        }
        
        string? userProfilePictureUrl = null;
        if (!string.IsNullOrEmpty(user?.ProfilePictureUrl))
        {
            userProfilePictureUrl = _fileStorageService.GetPresignedUrl(user.ProfilePictureUrl);
        }
        
        return new ProjectCommentDto
        {
            Id = comment.Id,
            ProjectId = comment.ProjectId,
            UserId = comment.UserId,
            UserName = $"{user?.FirstName ?? ""} {user?.LastName ?? ""}".Trim(),
            UserProfilePictureUrl = userProfilePictureUrl,
            Content = comment.Content,
            ParentCommentId = comment.ParentCommentId,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt,
            IsEdited = comment.IsEdited,
            RepliesCount = 0,
            MentionedUserIds = dto.MentionedUserIds,
            MentionedUserNames = [],
            FileReferences = fileReferenceDtos
        };
    }
    
    public async Task<ProjectCommentDto> UpdateCommentAsync(int commentId, UpdateProjectCommentDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var comment = await _context.ProjectComments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);
        
        if (comment == null)
        {
            throw new ArgumentException($"Comment with ID {commentId} not found");
        }
        
        if (comment.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can only edit your own comments");
        }
        
        comment.Content = dto.Content;
        comment.UpdatedAt = DateTime.UtcNow;
        comment.IsEdited = true;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        var repliesCount = await _context.ProjectComments
            .CountAsync(c => c.ParentCommentId == commentId, cancellationToken);
        
        string? userProfilePictureUrl = null;
        if (!string.IsNullOrEmpty(comment.User.ProfilePictureUrl))
        {
            userProfilePictureUrl = _fileStorageService.GetPresignedUrl(comment.User.ProfilePictureUrl);
        }
        
        return new ProjectCommentDto
        {
            Id = comment.Id,
            ProjectId = comment.ProjectId,
            UserId = comment.UserId,
            UserName = $"{comment.User.FirstName ?? ""} {comment.User.LastName ?? ""}".Trim(),
            UserProfilePictureUrl = userProfilePictureUrl,
            Content = comment.Content,
            ParentCommentId = comment.ParentCommentId,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt,
            IsEdited = comment.IsEdited,
            RepliesCount = repliesCount
        };
    }
    
    public async Task DeleteCommentAsync(int commentId, string userId, CancellationToken cancellationToken = default)
    {
        var comment = await _context.ProjectComments
            .Include(c => c.Replies)
            .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);
        
        if (comment == null)
        {
            throw new ArgumentException($"Comment with ID {commentId} not found");
        }
        
        if (comment.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can only delete your own comments");
        }
        
        if (comment.Replies.Any())
        {
            throw new InvalidOperationException("Cannot delete comment with replies");
        }
        
        _context.ProjectComments.Remove(comment);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<int> GetCommentsCountAsync(int projectId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectComments
            .CountAsync(c => c.ProjectId == projectId, cancellationToken);
    }
    
    public async Task<IEnumerable<MentionableUserDto>> GetProjectMentionableUsersAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(projectId);
        }
        
        var mentionableUsers = new List<MentionableUserDto>();
        
        // Add project owner (client)
        string? clientProfilePictureUrl = null;
        if (!string.IsNullOrEmpty(project.Client.ProfilePictureUrl))
        {
            clientProfilePictureUrl = _fileStorageService.GetPresignedUrl(project.Client.ProfilePictureUrl);
        }
        
        mentionableUsers.Add(new MentionableUserDto
        {
            UserId = project.ClientId,
            Name = $"{project.Client.FirstName ?? ""} {project.Client.LastName ?? ""}".Trim(),
            ProfilePictureUrl = clientProfilePictureUrl
        });
        
        // Add assigned specialists
        var assignedSpecialists = await _context.ProjectSpecialists
            .Where(ps => ps.ProjectId == projectId)
            .Include(ps => ps.Specialist)
                .ThenInclude(s => s.User)
            .Select(ps => new
            {
                ps.Specialist.UserId,
                ps.Specialist.User.FirstName,
                ps.Specialist.User.LastName,
                ps.Specialist.User.ProfilePictureUrl
            })
            .ToListAsync(cancellationToken);
        
        foreach (var specialist in assignedSpecialists)
        {
            string? specialistProfilePictureUrl = null;
            if (!string.IsNullOrEmpty(specialist.ProfilePictureUrl))
            {
                specialistProfilePictureUrl = _fileStorageService.GetPresignedUrl(specialist.ProfilePictureUrl);
            }
            
            mentionableUsers.Add(new MentionableUserDto
            {
                UserId = specialist.UserId,
                Name = $"{specialist.FirstName ?? ""} {specialist.LastName ?? ""}".Trim(),
                ProfilePictureUrl = specialistProfilePictureUrl
            });
        }
        
        return mentionableUsers;
    }

    private async Task<List<ApplicationUser>> GetAllAdminsAsync(CancellationToken cancellationToken = default)
    {
        var admins = await _userManager.GetUsersInRoleAsync("Admin");
        var superAdmins = await _userManager.GetUsersInRoleAsync("SuperAdmin");
        return admins.Union(superAdmins).ToList();
    }

    public async Task<ProjectFileDto> CopyTaskFileToProjectAsync(
        int projectId,
        int taskFileId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects.FindAsync([projectId], cancellationToken);
        if (project == null)
            throw new ProjectNotFoundException(projectId);

        var taskFile = await _context.Set<TaskAttachment>()
            .Include(tf => tf.Task)
            .FirstOrDefaultAsync(tf => tf.Id == taskFileId, cancellationToken);

        if (taskFile == null)
            throw new ValidationException($"Task file with ID {taskFileId} not found");

        if (taskFile.Task.ProjectId != projectId)
            throw new ValidationException("Task file does not belong to this project");

        var newFileKey = await _fileStorageService.CopyFileAsync(
            taskFile.FileUrl,
            $"projects/{projectId}/files/",
            cancellationToken);

        var projectFile = new ProjectFile
        {
            ProjectId = projectId,
            FileName = taskFile.FileName,
            FileUrl = newFileKey,
            FileSize = taskFile.FileSize,
            ContentType = taskFile.ContentType,
            UploadedBy = userId,
            UploadedAt = DateTime.UtcNow
        };

        _context.Set<ProjectFile>().Add(projectFile);
        await _context.SaveChangesAsync(cancellationToken);

        return new ProjectFileDto
        {
            Id = projectFile.Id,
            FileName = projectFile.FileName,
            FileUrl = _fileStorageService.GetPresignedUrl(projectFile.FileUrl),
            FileSize = projectFile.FileSize,
            ContentType = projectFile.ContentType,
            UploadedAt = projectFile.UploadedAt
        };
    }

    public async Task ChangeProjectClientAsync(int projectId, string newClientId, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        if (project == null)
        {
            throw new ProjectNotFoundException(projectId);
        }
        
        // Verify new client exists and has Client role
        var newClientExists = await _context.Users
            .AnyAsync(u => u.Id == newClientId && u.IsActive, cancellationToken);
        
        if (!newClientExists)
        {
            throw new InvalidOperationException("Client not found or user is not active");
        }
        
        // Verify user has Client role
        var hasClientRole = await _context.UserRoles
            .AnyAsync(ur => ur.UserId == newClientId && 
                           _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == UserRoles.Client), 
                      cancellationToken);
        
        if (!hasClientRole)
        {
            throw new InvalidOperationException("User is not a client");
        }
        
        // Update project client reference
        project.ClientId = newClientId;
        project.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        _logger.LogInformation("Project {ProjectId} client changed to {NewClientId}", projectId, newClientId);
    }

    public async Task<IEnumerable<ProjectFileDto>> AddFilesToProjectAsync(
        int projectId,
        string userId,
        string[] userRoles,
        List<FileUploadInfo> files,
        CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);

        if (project == null)
        {
            throw new ProjectNotFoundException(projectId);
        }

        var isAdmin = userRoles.Contains("Admin") || userRoles.Contains("SuperAdmin");
        var isClient = userRoles.Contains("Client");

        if (!isAdmin && (!isClient || project.ClientId != userId))
        {
            throw new UnauthorizedAccessException("You are not authorized to upload files to this project");
        }

        if (files == null || files.Count == 0)
        {
            return Enumerable.Empty<ProjectFileDto>();
        }

        var uploadedFiles = new List<ProjectFileDto>();
        var uploadedS3Keys = new List<string>();

        try
        {
            foreach (var file in files)
            {
                if (file.FileSize == 0)
                    continue;

                try
                {
                    var fileKey = await _fileStorageService.UploadProjectFileAsync(
                        file.FileStream,
                        file.FileName,
                        file.ContentType,
                        projectId,
                        cancellationToken);

                    uploadedS3Keys.Add(fileKey);

                    var projectFile = new ProjectFile
                    {
                        ProjectId = projectId,
                        FileName = file.FileName,
                        FileUrl = fileKey,
                        FileSize = file.FileSize,
                        ContentType = file.ContentType,
                        UploadedBy = userId,
                        UploadedAt = DateTime.UtcNow
                    };

                    _context.ProjectFiles.Add(projectFile);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to upload file {FileName} for project {ProjectId}",
                        file.FileName, projectId);
                    throw;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            var createdFiles = _context.ProjectFiles.Local.Where(pf => pf.ProjectId == projectId);

            foreach (var projectFile in createdFiles)
            {
                uploadedFiles.Add(new ProjectFileDto
                {
                    Id = projectFile.Id,
                    FileName = projectFile.FileName,
                    FileUrl = _fileStorageService.GetPresignedUrl(projectFile.FileUrl),
                    FileSize = projectFile.FileSize,
                    ContentType = projectFile.ContentType,
                    UploadedAt = projectFile.UploadedAt
                });
            }

            return uploadedFiles;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading files to project {ProjectId}. Rolling back and cleaning up S3 files.",
                projectId);

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
}
