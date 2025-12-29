using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Application.Services;

public class SpecialistService : ISpecialistService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<SpecialistService> _logger;
    private readonly IEmailService _emailService;
    private readonly WebAppConfig _webAppConfig;

    public SpecialistService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        ILogger<SpecialistService> logger,
        IEmailService emailService,
        IOptions<WebAppConfig> webAppConfig)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _logger = logger;
        _emailService = emailService;
        _webAppConfig = webAppConfig.Value;
    }

    public async Task<SpecialistDto> CreateSpecialistAsync(CreateSpecialistDto dto, CancellationToken cancellationToken = default)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId, cancellationToken);
        if (!userExists)
        {
            _logger.LogWarning("User with ID {UserId} not found", dto.UserId);
            throw new ArgumentException($"User with ID {dto.UserId} not found", nameof(dto.UserId));
        }

        var specialistExists = await _context.Set<Specialist>().AnyAsync(s => s.UserId == dto.UserId, cancellationToken);
        if (specialistExists)
        {
            _logger.LogWarning("Specialist profile already exists for user {UserId}", dto.UserId);
            throw new InvalidOperationException($"Specialist profile already exists for user {dto.UserId}");
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

        var specialist = new Specialist
        {
            UserId = dto.UserId,
            YearsOfExperience = dto.YearsOfExperience,
            HourlyRate = dto.HourlyRate,
            Specialization = dto.Specialization,
            IsAvailable = true,
            Rating = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Set<Specialist>().Add(specialist);
        await _context.SaveChangesAsync(cancellationToken);

        var specialistLicenseTypes = dto.LicenseTypeIds
            .Select(ltId => new SpecialistLicenseType
            {
                SpecialistId = specialist.Id,
                LicenseTypeId = ltId
            })
            .ToList();

        _context.Set<SpecialistLicenseType>().AddRange(specialistLicenseTypes);
        await _context.SaveChangesAsync(cancellationToken);

        var user = await _context.Users.FindAsync(dto.UserId);

        return new SpecialistDto
        {
            Id = specialist.Id,
            UserId = specialist.UserId,
            FirstName = user!.FirstName ?? string.Empty,
            LastName = user.LastName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(user.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(user.ProfilePictureUrl)
                : null,
            YearsOfExperience = specialist.YearsOfExperience,
            HourlyRate = specialist.HourlyRate,
            Rating = specialist.Rating,
            IsAvailable = specialist.IsAvailable,
            Specialization = specialist.Specialization,
            LicenseTypeIds = dto.LicenseTypeIds
        };
    }

    public async Task<SpecialistDetailsDto> GetSpecialistByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Set<Specialist>()
            .Include(s => s.User)
            .Include(s => s.LicenseTypes)
                .ThenInclude(slt => slt.LicenseType)
                    .ThenInclude(lt => lt.ProfessionTypeLicenseRequirements)
                        .ThenInclude(ptlr => ptlr.ProfessionType)
                            .ThenInclude(pt => pt.Profession)
            .Include(s => s.AssignedProjects)
                .ThenInclude(ps => ps.Project)
            .Include(s => s.Portfolio)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (specialist == null)
            throw new SpecialistNotFoundException(id);

        return MapToDetailsDto(specialist);
    }

    public async Task<SpecialistDetailsDto> GetSpecialistByUserIdAsync(string userId, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Set<Specialist>()
            .Include(s => s.User)
            .Include(s => s.LicenseTypes)
                .ThenInclude(slt => slt.LicenseType)
                    .ThenInclude(lt => lt.ProfessionTypeLicenseRequirements)
                        .ThenInclude(ptlr => ptlr.ProfessionType)
                            .ThenInclude(pt => pt.Profession)
            .Include(s => s.AssignedProjects)
                .ThenInclude(ps => ps.Project)
            .Include(s => s.Portfolio)
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        if (specialist == null)
            throw new SpecialistNotFoundException($"Specialist with user ID {userId} not found");

        return MapToDetailsDto(specialist);
    }

    public async Task<IEnumerable<SpecialistDto>> GetSpecialistsAsync(CancellationToken cancellationToken = default)
    {
        var specialists = await _context.Set<Specialist>()
            .Include(s => s.User)
            .Include(s => s.LicenseTypes)
            .ToListAsync(cancellationToken);

        return specialists.Select(s => new SpecialistDto
        {
            Id = s.Id,
            UserId = s.UserId,
            FirstName = s.User.FirstName ?? string.Empty,
            LastName = s.User.LastName ?? string.Empty,
            Email = s.User.Email ?? string.Empty,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(s.User.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(s.User.ProfilePictureUrl)
                : null,
            YearsOfExperience = s.YearsOfExperience,
            HourlyRate = s.HourlyRate,
            Rating = s.Rating,
            IsAvailable = s.IsAvailable,
            Specialization = s.Specialization,
            LicenseTypeIds = s.LicenseTypes.Select(slt => slt.LicenseTypeId).ToArray()
        });
    }

    public async Task<SpecialistDto> UpdateSpecialistAsync(int id, UpdateSpecialistDto dto, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Set<Specialist>()
            .Include(s => s.User)
            .Include(s => s.LicenseTypes)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (specialist == null)
            throw new SpecialistNotFoundException(id);

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

        specialist.YearsOfExperience = dto.YearsOfExperience;
        specialist.HourlyRate = dto.HourlyRate;
        specialist.IsAvailable = dto.IsAvailable;
        specialist.Specialization = dto.Specialization;
        specialist.UpdatedAt = DateTime.UtcNow;

        if (dto.FirstName != null)
            specialist.User.FirstName = dto.FirstName;
        
        if (dto.LastName != null)
            specialist.User.LastName = dto.LastName;
        
        if (dto.Biography != null)
            specialist.User.Biography = dto.Biography;
        
        if (dto.Location != null)
            specialist.User.Location = dto.Location;
        
        if (dto.Website != null)
            specialist.User.Website = dto.Website;

        specialist.User.UpdatedAt = DateTime.UtcNow;

        var currentLicenseTypeIds = specialist.LicenseTypes.Select(slt => slt.LicenseTypeId).ToList();
        var toRemove = specialist.LicenseTypes.Where(slt => !dto.LicenseTypeIds.Contains(slt.LicenseTypeId)).ToList();
        var toAdd = dto.LicenseTypeIds.Where(ltId => !currentLicenseTypeIds.Contains(ltId))
            .Select(ltId => new SpecialistLicenseType
            {
                SpecialistId = specialist.Id,
                LicenseTypeId = ltId
            })
            .ToList();

        _context.Set<SpecialistLicenseType>().RemoveRange(toRemove);
        _context.Set<SpecialistLicenseType>().AddRange(toAdd);

        await _context.SaveChangesAsync(cancellationToken);

        return new SpecialistDto
        {
            Id = specialist.Id,
            UserId = specialist.UserId,
            FirstName = specialist.User.FirstName ?? string.Empty,
            LastName = specialist.User.LastName ?? string.Empty,
            Email = specialist.User.Email ?? string.Empty,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(specialist.User.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(specialist.User.ProfilePictureUrl)
                : null,
            YearsOfExperience = specialist.YearsOfExperience,
            HourlyRate = specialist.HourlyRate,
            Rating = specialist.Rating,
            IsAvailable = specialist.IsAvailable,
            Specialization = specialist.Specialization,
            LicenseTypeIds = dto.LicenseTypeIds
        };
    }

    public async Task DeleteSpecialistAsync(int id, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Set<Specialist>().FindAsync([id], cancellationToken);

        if (specialist == null)
            throw new SpecialistNotFoundException(id);

        _context.Set<Specialist>().Remove(specialist);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<SpecialistDto>> GetSpecialistsByLicenseTypeAsync(int licenseTypeId, CancellationToken cancellationToken = default)
    {
        var specialists = await _context.Set<Specialist>()
            .Include(s => s.User)
            .Include(s => s.LicenseTypes)
            .Where(s => s.LicenseTypes.Any(slt => slt.LicenseTypeId == licenseTypeId))
            .ToListAsync(cancellationToken);

        return specialists.Select(s => new SpecialistDto
        {
            Id = s.Id,
            UserId = s.UserId,
            FirstName = s.User.FirstName ?? string.Empty,
            LastName = s.User.LastName ?? string.Empty,
            Email = s.User.Email ?? string.Empty,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(s.User.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(s.User.ProfilePictureUrl)
                : null,
            YearsOfExperience = s.YearsOfExperience,
            HourlyRate = s.HourlyRate,
            Rating = s.Rating,
            IsAvailable = s.IsAvailable,
            Specialization = s.Specialization,
            LicenseTypeIds = s.LicenseTypes.Select(slt => slt.LicenseTypeId).ToArray()
        });
    }

    public async Task AssignSpecialistToProjectAsync(int projectId, int specialistId, string? role = null, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        if (project == null)
        {
            _logger.LogWarning("Project with ID {ProjectId} not found", projectId);
            throw new ProjectNotFoundException(projectId);
        }

        var specialist = await _context.Set<Specialist>()
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == specialistId, cancellationToken);
        
        if (specialist == null)
        {
            _logger.LogWarning("Specialist with ID {SpecialistId} not found", specialistId);
            throw new SpecialistNotFoundException(specialistId);
        }

        var assignmentExists = await _context.Set<ProjectSpecialist>()
            .AnyAsync(ps => ps.ProjectId == projectId && ps.SpecialistId == specialistId, cancellationToken);

        if (assignmentExists)
            throw new SpecialistAlreadyAssignedException(specialistId, projectId);

        var projectSpecialist = new ProjectSpecialist
        {
            ProjectId = projectId,
            SpecialistId = specialistId,
            Role = role,
            AssignedAt = DateTime.UtcNow
        };

        _context.Set<ProjectSpecialist>().Add(projectSpecialist);
        await _context.SaveChangesAsync(cancellationToken);

        // Send project assigned email to specialist
        var specialistName = $"{specialist.User.FirstName} {specialist.User.LastName}";
        var address = $"{project.StreetAddress}, {project.City}, {project.State}";
        var projectUrl = $"{_webAppConfig.BaseUrl}/specialist/projects/{projectId}";

        await _emailService.SendProjectAssignedNotificationAsync(
            specialist.User.Email!,
            specialistName,
            project.Name,
            role ?? "Specialist",
            address,
            project.StartDate,
            projectUrl,
            cancellationToken);
    }

    public async Task RemoveSpecialistFromProjectAsync(int projectId, int specialistId, CancellationToken cancellationToken = default)
    {
        var projectSpecialist = await _context.Set<ProjectSpecialist>()
            .FirstOrDefaultAsync(ps => ps.ProjectId == projectId && ps.SpecialistId == specialistId, cancellationToken);

        if (projectSpecialist == null)
        {
            _logger.LogWarning("Assignment not found: Project {ProjectId}, Specialist {SpecialistId}", projectId, specialistId);
            throw new InvalidOperationException($"Specialist {specialistId} is not assigned to project {projectId}");
        }

        _context.Set<ProjectSpecialist>().Remove(projectSpecialist);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private SpecialistDetailsDto MapToDetailsDto(Specialist specialist)
    {
        // Only include approved licenses
        var approvedLicenses = specialist.LicenseTypes
            .Where(slt => slt.Status == LicenseRequestStatus.Approved)
            .ToList();

        return new SpecialistDetailsDto
        {
            Id = specialist.Id,
            UserId = specialist.UserId,
            FirstName = specialist.User.FirstName ?? string.Empty,
            LastName = specialist.User.LastName ?? string.Empty,
            Email = specialist.User.Email ?? string.Empty,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(specialist.User.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(specialist.User.ProfilePictureUrl)
                : null,
            Biography = specialist.User.Biography,
            Location = specialist.User.Location,
            Website = specialist.User.Website,
            YearsOfExperience = specialist.YearsOfExperience,
            HourlyRate = specialist.HourlyRate,
            Rating = specialist.Rating,
            IsAvailable = specialist.IsAvailable,
            Specialization = specialist.Specialization,
            LicenseTypeIds = approvedLicenses.Select(slt => slt.LicenseTypeId).ToArray(),
            LicenseTypes = approvedLicenses.Select(slt =>
            {
                var profession = slt.LicenseType.ProfessionTypeLicenseRequirements
                    .FirstOrDefault()?.ProfessionType?.Profession;
                
                return new LicenseTypeDto
                {
                    Id = slt.LicenseType.Id,
                    Name = slt.LicenseType.Name,
                    Code = slt.LicenseType.Code,
                    Description = slt.LicenseType.Description,
                    IsStateSpecific = slt.LicenseType.IsStateSpecific,
                    ProfessionId = profession?.Id,
                    ProfessionName = profession?.Name
                };
            }).ToArray(),
            Portfolio = specialist.Portfolio.Select(p => new PortfolioItemDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ThumbnailUrl = !string.IsNullOrWhiteSpace(p.ThumbnailUrl)
                    ? _fileStorageService.GetPresignedUrl(p.ThumbnailUrl)
                    : null,
                ProjectUrl = p.ProjectUrl,
                CreatedAt = p.CreatedAt
            }).ToArray(),
            AssignedProjects = specialist.AssignedProjects.Select(ps => new AssignedProjectDto
            {
                ProjectId = ps.ProjectId,
                ProjectName = ps.Project.Name,
                Status = ps.Project.Status.ToString(),
                Role = ps.Role,
                AssignedAt = ps.AssignedAt
            }).ToArray(),
            Reviews = [],
            Stats = null,
            CreatedAt = specialist.CreatedAt,
            UpdatedAt = specialist.UpdatedAt
        };
    }

    public async Task<IEnumerable<AvailableSpecialistDto>> GetSpecialistsByLicenseTypesAsync(int[] licenseTypeIds, CancellationToken cancellationToken = default)
    {
        var specialists = await _context.Specialists
            .Include(s => s.User)
            .Include(s => s.LicenseTypes)
                .ThenInclude(slt => slt.LicenseType)
            .Where(s => s.IsAvailable
                && s.LicenseTypes.Any(slt => licenseTypeIds.Contains(slt.LicenseTypeId)))
            .ToListAsync(cancellationToken);

        return specialists.Select(s => new AvailableSpecialistDto
        {
            UserId = s.UserId,
            Name = $"{s.User.FirstName} {s.User.LastName}",
            Email = s.User.Email!,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(s.User.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(s.User.ProfilePictureUrl)
                : null,
            Location = s.User.Location,
            IsAvailableForHire = s.IsAvailable,
            LicenseTypes = s.LicenseTypes.Select(slt => new LicenseTypeDto
            {
                Id = slt.LicenseType.Id,
                Name = slt.LicenseType.Name,
                Code = slt.LicenseType.Code,
                Description = slt.LicenseType.Description,
                IsStateSpecific = slt.LicenseType.IsStateSpecific
            }).ToList()
        });
    }

    public async Task<IEnumerable<AvailableSpecialistDto>> GetAvailableSpecialistsForProjectAsync(int projectId, int[] licenseTypeIds, CancellationToken cancellationToken = default)
    {
        var existingBidSpecialistIds = await _context.BidRequests
            .Where(br => br.ProjectId == projectId)
            .Select(br => br.SpecialistId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var specialists = await _context.Specialists
            .Include(s => s.User)
            .Include(s => s.LicenseTypes)
                .ThenInclude(slt => slt.LicenseType)
            .Where(s => s.IsAvailable
                && !existingBidSpecialistIds.Contains(s.Id)
                && s.LicenseTypes.Any(slt => licenseTypeIds.Contains(slt.LicenseTypeId)))
            .ToListAsync(cancellationToken);

        return specialists.Select(s => new AvailableSpecialistDto
        {
            UserId = s.UserId,
            Name = $"{s.User.FirstName} {s.User.LastName}",
            Email = s.User.Email!,
            ProfilePictureUrl = !string.IsNullOrWhiteSpace(s.User.ProfilePictureUrl)
                ? _fileStorageService.GetPresignedUrl(s.User.ProfilePictureUrl)
                : null,
            Location = s.User.Location,
            IsAvailableForHire = s.IsAvailable,
            LicenseTypes = s.LicenseTypes.Select(slt => new LicenseTypeDto
            {
                Id = slt.LicenseType.Id,
                Name = slt.LicenseType.Name,
                Code = slt.LicenseType.Code,
                Description = slt.LicenseType.Description,
                IsStateSpecific = slt.LicenseType.IsStateSpecific
            }).ToList()
        });
    }

    public async Task<IEnumerable<ProjectDto>> GetSpecialistProjectsAsync(int specialistId, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Set<Specialist>()
            .AnyAsync(s => s.Id == specialistId, cancellationToken);

        if (!specialist)
            throw new SpecialistNotFoundException(specialistId);

        var projects = await _context.Set<ProjectSpecialist>()
            .Where(ps => ps.SpecialistId == specialistId)
            .Include(ps => ps.Project)
            .ThenInclude(p => p.ProjectLicenseTypes)
            .Select(ps => ps.Project)
            .ToListAsync(cancellationToken);

        return projects.Select(p => new ProjectDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Status = p.Status.ToString(),
            CreatedAt = p.CreatedAt,
            ThumbnailUrl = p.ThumbnailUrl,
            StreetAddress = p.StreetAddress,
            City = p.City,
            State = p.State,
            ZipCode = p.ZipCode,
            ProjectScope = (int)p.ProjectScope,
            ManagementType = p.ManagementType.ToString(),
            LicenseTypeIds = p.ProjectLicenseTypes.Select(plt => plt.LicenseTypeId).ToArray()
        });
    }

    public async Task<SpecialistStatsDto> GetSpecialistStatsAsync(int specialistId, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Set<Specialist>()
            .Include(s => s.AssignedProjects)
            .FirstOrDefaultAsync(s => s.Id == specialistId, cancellationToken);

        if (specialist == null)
            throw new SpecialistNotFoundException(specialistId);

        var completedProjects = specialist.AssignedProjects
            .Count(ps => ps.Project.Status == ProjectStatus.Completed);

        var totalReviews = await _context.Set<Review>()
            .CountAsync(r => r.SpecialistId == specialistId, cancellationToken);

        return new SpecialistStatsDto
        {
            CompletedProjects = completedProjects,
            TotalReviews = totalReviews,
            AverageRating = specialist.Rating,
            YearsOfExperience = specialist.YearsOfExperience,
            HourlyRate = specialist.HourlyRate
        };
    }

    public async Task UpdateProfilePictureAsync(int specialistId, string profilePictureUrl, CancellationToken cancellationToken = default)
    {
        var specialist = await _context.Set<Specialist>()
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == specialistId, cancellationToken);

        if (specialist == null)
            throw new SpecialistNotFoundException(specialistId);

        specialist.User.ProfilePictureUrl = profilePictureUrl;
        specialist.User.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
