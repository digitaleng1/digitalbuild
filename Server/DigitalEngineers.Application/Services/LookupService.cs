using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class LookupService : ILookupService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<LookupService> _logger;

    public LookupService(
        ApplicationDbContext context,
        IEmailService emailService,
        ILogger<LookupService> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    public Task<IEnumerable<StateDto>> GetStatesAsync(CancellationToken cancellationToken = default)
    {
        var usStates = new List<StateDto>
        {
            new() { Value = "AL", Label = "Alabama" },
            new() { Value = "AK", Label = "Alaska" },
            new() { Value = "AZ", Label = "Arizona" },
            new() { Value = "AR", Label = "Arkansas" },
            new() { Value = "CA", Label = "California" },
            new() { Value = "CO", Label = "Colorado" },
            new() { Value = "CT", Label = "Connecticut" },
            new() { Value = "DE", Label = "Delaware" },
            new() { Value = "DC", Label = "District of Columbia" },
            new() { Value = "FL", Label = "Florida" },
            new() { Value = "GA", Label = "Georgia" },
            new() { Value = "HI", Label = "Hawaii" },
            new() { Value = "ID", Label = "Idaho" },
            new() { Value = "IL", Label = "Illinois" },
            new() { Value = "IN", Label = "Indiana" },
            new() { Value = "IA", Label = "Iowa" },
            new() { Value = "KS", Label = "Kansas" },
            new() { Value = "KY", Label = "Kentucky" },
            new() { Value = "LA", Label = "Louisiana" },
            new() { Value = "ME", Label = "Maine" },
            new() { Value = "MD", Label = "Maryland" },
            new() { Value = "MA", Label = "Massachusetts" },
            new() { Value = "MI", Label = "Michigan" },
            new() { Value = "MN", Label = "Minnesota" },
            new() { Value = "MS", Label = "Mississippi" },
            new() { Value = "MO", Label = "Missouri" },
            new() { Value = "MT", Label = "Montana" },
            new() { Value = "NE", Label = "Nebraska" },
            new() { Value = "NV", Label = "Nevada" },
            new() { Value = "NH", Label = "New Hampshire" },
            new() { Value = "NJ", Label = "New Jersey" },
            new() { Value = "NM", Label = "New Mexico" },
            new() { Value = "NY", Label = "New York" },
            new() { Value = "NC", Label = "North Carolina" },
            new() { Value = "ND", Label = "North Dakota" },
            new() { Value = "OH", Label = "Ohio" },
            new() { Value = "OK", Label = "Oklahoma" },
            new() { Value = "OR", Label = "Oregon" },
            new() { Value = "PA", Label = "Pennsylvania" },
            new() { Value = "RI", Label = "Rhode Island" },
            new() { Value = "SC", Label = "South Carolina" },
            new() { Value = "SD", Label = "South Dakota" },
            new() { Value = "TN", Label = "Tennessee" },
            new() { Value = "TX", Label = "Texas" },
            new() { Value = "UT", Label = "Utah" },
            new() { Value = "VT", Label = "Vermont" },
            new() { Value = "VA", Label = "Virginia" },
            new() { Value = "WA", Label = "Washington" },
            new() { Value = "WV", Label = "West Virginia" },
            new() { Value = "WI", Label = "Wisconsin" },
            new() { Value = "WY", Label = "Wyoming" }
        };

        return Task.FromResult<IEnumerable<StateDto>>(usStates);
    }

    public async Task<IEnumerable<ProfessionDto>> GetProfessionsAsync(CancellationToken cancellationToken = default)
    {
        var professions = await _context.Professions
            .AsNoTracking()
            .Where(p => p.IsApproved)
            .Select(p => new ProfessionDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description
            })
            .ToListAsync(cancellationToken);

        return professions;
    }

    public async Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesAsync(CancellationToken cancellationToken = default)
    {
        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Where(lt => lt.IsApproved)
            .Select(lt => new LicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Description = lt.Description,
                ProfessionId = lt.ProfessionId
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }

    public async Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default)
    {
        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Where(lt => lt.ProfessionId == professionId && lt.IsApproved)
            .Select(lt => new LicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Description = lt.Description,
                ProfessionId = lt.ProfessionId
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }

    // Client operations
    public async Task<ProfessionDto> CreateProfessionAsync(CreateProfessionDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var exists = await _context.Professions
            .AnyAsync(p => p.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (exists)
            throw new DuplicateProfessionException(dto.Name);

        var profession = new Infrastructure.Entities.Profession
        {
            Name = dto.Name,
            Description = dto.Description,
            IsApproved = true, // ✅ Immediately approved
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        _context.Professions.Add(profession);
        await _context.SaveChangesAsync(cancellationToken);
        
        return new ProfessionDto
        {
            Id = profession.Id,
            Name = profession.Name,
            Description = profession.Description
        };
    }

    public async Task<LicenseTypeDto> CreateLicenseTypeAsync(CreateLicenseTypeDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var profession = await _context.Professions
            .FirstOrDefaultAsync(p => p.Id == dto.ProfessionId, cancellationToken);
        
        if (profession == null)
            throw new ProfessionNotFoundException(dto.ProfessionId);
        
        var exists = await _context.LicenseTypes
            .AnyAsync(lt => lt.ProfessionId == dto.ProfessionId && 
                           lt.Name.ToLower() == dto.Name.ToLower(), 
                     cancellationToken);
        
        if (exists)
            throw new DuplicateLicenseTypeException(dto.Name, dto.ProfessionId);
        
        var licenseType = new Infrastructure.Entities.LicenseType
        {
            Name = dto.Name,
            Description = dto.Description,
            ProfessionId = dto.ProfessionId,
            IsApproved = true, // ✅ Immediately approved
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        _context.LicenseTypes.Add(licenseType);
        await _context.SaveChangesAsync(cancellationToken);
        
        return new LicenseTypeDto
        {
            Id = licenseType.Id,
            Name = licenseType.Name,
            Description = licenseType.Description,
            ProfessionId = licenseType.ProfessionId
        };
    }

    // Admin management
    public async Task<IEnumerable<ProfessionManagementDto>> GetAllProfessionsForManagementAsync(CancellationToken cancellationToken = default)
    {
        var professions = await _context.Professions
            .AsNoTracking()
            .Include(p => p.CreatedBy)
            .Include(p => p.LicenseTypes)
            .OrderBy(p => p.IsApproved)
            .ThenByDescending(p => p.CreatedAt)
            .Select(p => new ProfessionManagementDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                IsApproved = p.IsApproved,
                CreatedByUserId = p.CreatedByUserId,
                CreatedByUserName = p.CreatedBy != null 
                    ? $"{p.CreatedBy.FirstName} {p.CreatedBy.LastName}" 
                    : "System",
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                RejectionReason = p.RejectionReason,
                LicenseTypesCount = p.LicenseTypes.Count
            })
            .ToListAsync(cancellationToken);

        return professions;
    }

    public async Task<IEnumerable<LicenseTypeManagementDto>> GetAllLicenseTypesForManagementAsync(CancellationToken cancellationToken = default)
    {
        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Include(lt => lt.CreatedBy)
            .Include(lt => lt.Profession)
            .OrderBy(lt => lt.IsApproved)
            .ThenByDescending(lt => lt.CreatedAt)
            .Select(lt => new LicenseTypeManagementDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Description = lt.Description,
                ProfessionId = lt.ProfessionId,
                ProfessionName = lt.Profession.Name,
                IsApproved = lt.IsApproved,
                CreatedByUserId = lt.CreatedByUserId,
                CreatedByUserName = lt.CreatedBy != null 
                    ? $"{lt.CreatedBy.FirstName} {lt.CreatedBy.LastName}" 
                    : "System",
                CreatedAt = lt.CreatedAt,
                UpdatedAt = lt.UpdatedAt,
                RejectionReason = lt.RejectionReason
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }

    public async Task<ProfessionManagementDto> UpdateProfessionAsync(int id, UpdateProfessionDto dto, CancellationToken cancellationToken = default)
    {
        var profession = await _context.Professions
            .Include(p => p.CreatedBy)
            .Include(p => p.LicenseTypes)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        
        if (profession == null)
            throw new ProfessionNotFoundException(id);
        
        var existingWithSameName = await _context.Professions
            .AnyAsync(p => p.Id != id && p.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (existingWithSameName)
            throw new DuplicateProfessionException(dto.Name);
        
        profession.Name = dto.Name;
        profession.Description = dto.Description;
        profession.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        return new ProfessionManagementDto
        {
            Id = profession.Id,
            Name = profession.Name,
            Description = profession.Description,
            IsApproved = profession.IsApproved,
            CreatedByUserId = profession.CreatedByUserId,
            CreatedByUserName = profession.CreatedBy != null 
                ? $"{profession.CreatedBy.FirstName} {profession.CreatedBy.LastName}" 
                : "System",
            CreatedAt = profession.CreatedAt,
            UpdatedAt = profession.UpdatedAt,
            RejectionReason = profession.RejectionReason,
            LicenseTypesCount = profession.LicenseTypes.Count
        };
    }

    public async Task<LicenseTypeManagementDto> UpdateLicenseTypeAsync(int id, UpdateLicenseTypeDto dto, CancellationToken cancellationToken = default)
    {
        var licenseType = await _context.LicenseTypes
            .Include(lt => lt.CreatedBy)
            .Include(lt => lt.Profession)
            .FirstOrDefaultAsync(lt => lt.Id == id, cancellationToken);
        
        if (licenseType == null)
            throw new LicenseTypeNotFoundException(id);
        
        var profession = await _context.Professions
            .FirstOrDefaultAsync(p => p.Id == dto.ProfessionId, cancellationToken);
        
        if (profession == null)
            throw new ProfessionNotFoundException(dto.ProfessionId);
        
        var existingWithSameName = await _context.LicenseTypes
            .AnyAsync(lt => lt.Id != id && 
                           lt.ProfessionId == dto.ProfessionId && 
                           lt.Name.ToLower() == dto.Name.ToLower(), 
                     cancellationToken);
        
        if (existingWithSameName)
            throw new DuplicateLicenseTypeException(dto.Name, dto.ProfessionId);
        
        licenseType.Name = dto.Name;
        licenseType.Description = dto.Description;
        licenseType.ProfessionId = dto.ProfessionId;
        licenseType.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        return new LicenseTypeManagementDto
        {
            Id = licenseType.Id,
            Name = licenseType.Name,
            Description = licenseType.Description,
            ProfessionId = licenseType.ProfessionId,
            ProfessionName = licenseType.Profession.Name,
            IsApproved = licenseType.IsApproved,
            CreatedByUserId = licenseType.CreatedByUserId,
            CreatedByUserName = licenseType.CreatedBy != null 
                ? $"{licenseType.CreatedBy.FirstName} {licenseType.CreatedBy.LastName}" 
                : "System",
            CreatedAt = licenseType.CreatedAt,
            UpdatedAt = licenseType.UpdatedAt,
            RejectionReason = licenseType.RejectionReason
        };
    }

    public async Task<ProfessionManagementDto> ApproveProfessionAsync(int id, ApproveProfessionDto dto, CancellationToken cancellationToken = default)
    {
        var profession = await _context.Professions
            .Include(p => p.CreatedBy)
            .Include(p => p.LicenseTypes)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        
        if (profession == null)
            throw new ProfessionNotFoundException(id);
        
        if (!dto.IsApproved && string.IsNullOrWhiteSpace(dto.RejectionReason))
            throw new ValidationException("Rejection reason is required when rejecting a profession");
        
        profession.IsApproved = dto.IsApproved;
        profession.RejectionReason = dto.IsApproved ? null : dto.RejectionReason;
        profession.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);

        if (profession.CreatedBy != null)
        {
            if (dto.IsApproved)
            {
                await _emailService.SendProfessionApprovalNotificationAsync(
                    profession.CreatedBy.Email!,
                    $"{profession.CreatedBy.FirstName} {profession.CreatedBy.LastName}",
                    profession.Name,
                    cancellationToken);
            }
            else
            {
                await _emailService.SendProfessionRejectionNotificationAsync(
                    profession.CreatedBy.Email!,
                    $"{profession.CreatedBy.FirstName} {profession.CreatedBy.LastName}",
                    profession.Name,
                    dto.RejectionReason!,
                    cancellationToken);
            }
        }
        
        return new ProfessionManagementDto
        {
            Id = profession.Id,
            Name = profession.Name,
            Description = profession.Description,
            IsApproved = profession.IsApproved,
            CreatedByUserId = profession.CreatedByUserId,
            CreatedByUserName = profession.CreatedBy != null 
                ? $"{profession.CreatedBy.FirstName} {profession.CreatedBy.LastName}" 
                : "System",
            CreatedAt = profession.CreatedAt,
            UpdatedAt = profession.UpdatedAt,
            RejectionReason = profession.RejectionReason,
            LicenseTypesCount = profession.LicenseTypes.Count
        };
    }

    public async Task<LicenseTypeManagementDto> ApproveLicenseTypeAsync(int id, ApproveLicenseTypeDto dto, CancellationToken cancellationToken = default)
    {
        var licenseType = await _context.LicenseTypes
            .Include(lt => lt.CreatedBy)
            .Include(lt => lt.Profession)
            .FirstOrDefaultAsync(lt => lt.Id == id, cancellationToken);
        
        if (licenseType == null)
            throw new LicenseTypeNotFoundException(id);
        
        if (!dto.IsApproved && string.IsNullOrWhiteSpace(dto.RejectionReason))
            throw new ValidationException("Rejection reason is required when rejecting a license type");
        
        licenseType.IsApproved = dto.IsApproved;
        licenseType.RejectionReason = dto.IsApproved ? null : dto.RejectionReason;
        licenseType.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);

        if (licenseType.CreatedBy != null)
        {
            if (dto.IsApproved)
            {
                await _emailService.SendLicenseTypeApprovalNotificationAsync(
                    licenseType.CreatedBy.Email!,
                    $"{licenseType.CreatedBy.FirstName} {licenseType.CreatedBy.LastName}",
                    licenseType.Name,
                    licenseType.Profession.Name,
                    cancellationToken);
            }
            else
            {
                await _emailService.SendLicenseTypeRejectionNotificationAsync(
                    licenseType.CreatedBy.Email!,
                    $"{licenseType.CreatedBy.FirstName} {licenseType.CreatedBy.LastName}",
                    licenseType.Name,
                    licenseType.Profession.Name,
                    dto.RejectionReason!,
                    cancellationToken);
            }
        }
        
        return new LicenseTypeManagementDto
        {
            Id = licenseType.Id,
            Name = licenseType.Name,
            Description = licenseType.Description,
            ProfessionId = licenseType.ProfessionId,
            ProfessionName = licenseType.Profession.Name,
            IsApproved = licenseType.IsApproved,
            CreatedByUserId = licenseType.CreatedByUserId,
            CreatedByUserName = licenseType.CreatedBy != null 
                ? $"{licenseType.CreatedBy.FirstName} {licenseType.CreatedBy.LastName}" 
                : "System",
            CreatedAt = licenseType.CreatedAt,
            UpdatedAt = licenseType.UpdatedAt,
            RejectionReason = licenseType.RejectionReason
        };
    }

    public async Task DeleteProfessionAsync(int id, CancellationToken cancellationToken = default)
    {
        var profession = await _context.Professions
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        
        if (profession == null)
            throw new ProfessionNotFoundException(id);
        
        _context.Professions.Remove(profession);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteLicenseTypeAsync(int id, CancellationToken cancellationToken = default)
    {
        var licenseType = await _context.LicenseTypes
            .FirstOrDefaultAsync(lt => lt.Id == id, cancellationToken);
        
        if (licenseType == null)
            throw new LicenseTypeNotFoundException(id);
        
        _context.LicenseTypes.Remove(licenseType);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
