using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class SpecialistService : ISpecialistService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SpecialistService> _logger;

    public SpecialistService(ApplicationDbContext context, ILogger<SpecialistService> logger)
    {
        _context = context;
        _logger = logger;
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
            ProfilePictureUrl = user.ProfilePictureUrl,
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
            .Include(s => s.AssignedProjects)
                .ThenInclude(ps => ps.Project)
            .Include(s => s.Portfolio)
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        if (specialist == null)
            throw new ArgumentException($"Specialist with user ID {userId} not found");

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
            ProfilePictureUrl = s.User.ProfilePictureUrl,
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
            ProfilePictureUrl = specialist.User.ProfilePictureUrl,
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
            ProfilePictureUrl = s.User.ProfilePictureUrl,
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
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == projectId, cancellationToken);
        if (!projectExists)
        {
            _logger.LogWarning("Project with ID {ProjectId} not found", projectId);
            throw new ProjectNotFoundException(projectId);
        }

        var specialistExists = await _context.Set<Specialist>().AnyAsync(s => s.Id == specialistId, cancellationToken);
        if (!specialistExists)
        {
            _logger.LogWarning("Specialist with ID {SpecialistId} not found", specialistId);
            throw new SpecialistNotFoundException(specialistId);
        }

        var assignmentExists = await _context.Set<ProjectSpecialist>()
            .AnyAsync(ps => ps.ProjectId == projectId && ps.SpecialistId == specialistId, cancellationToken);

        if (assignmentExists)
        {
            _logger.LogWarning("Specialist {SpecialistId} is already assigned to project {ProjectId}", specialistId, projectId);
            throw new InvalidOperationException($"Specialist {specialistId} is already assigned to project {projectId}");
        }

        var projectSpecialist = new ProjectSpecialist
        {
            ProjectId = projectId,
            SpecialistId = specialistId,
            Role = role,
            AssignedAt = DateTime.UtcNow
        };

        _context.Set<ProjectSpecialist>().Add(projectSpecialist);
        await _context.SaveChangesAsync(cancellationToken);
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

    private static SpecialistDetailsDto MapToDetailsDto(Specialist specialist)
    {
        return new SpecialistDetailsDto
        {
            Id = specialist.Id,
            UserId = specialist.UserId,
            FirstName = specialist.User.FirstName ?? string.Empty,
            LastName = specialist.User.LastName ?? string.Empty,
            Email = specialist.User.Email ?? string.Empty,
            ProfilePictureUrl = specialist.User.ProfilePictureUrl,
            Biography = specialist.User.Biography,
            Location = specialist.User.Location,
            Website = specialist.User.Website,
            YearsOfExperience = specialist.YearsOfExperience,
            HourlyRate = specialist.HourlyRate,
            Rating = specialist.Rating,
            IsAvailable = specialist.IsAvailable,
            Specialization = specialist.Specialization,
            LicenseTypeIds = specialist.LicenseTypes.Select(slt => slt.LicenseTypeId).ToArray(),
            LicenseTypes = specialist.LicenseTypes.Select(slt => new LicenseTypeDto
            {
                Id = slt.LicenseType.Id,
                Name = slt.LicenseType.Name,
                Description = slt.LicenseType.Description,
                ProfessionId = slt.LicenseType.ProfessionId
            }).ToArray(),
            Portfolio = specialist.Portfolio.Select(p => new PortfolioItemDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ThumbnailUrl = p.ThumbnailUrl,
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
            CreatedAt = specialist.CreatedAt,
            UpdatedAt = specialist.UpdatedAt
        };
    }
}
