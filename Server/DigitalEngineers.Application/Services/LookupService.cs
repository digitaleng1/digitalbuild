using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
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

    #region Professions

    public async Task<IEnumerable<ProfessionDto>> GetProfessionsAsync(CancellationToken cancellationToken = default)
    {
        var professions = await _context.Professions
            .AsNoTracking()
            .Where(p => p.IsApproved)
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Name)
            .Select(p => new ProfessionDto
            {
                Id = p.Id,
                Name = p.Name,
                Code = p.Code,
                Description = p.Description,
                ProfessionTypesCount = p.ProfessionTypes.Count(pt => pt.IsActive && pt.IsApproved)
            })
            .ToListAsync(cancellationToken);

        return professions;
    }

    public async Task<ProfessionDto> CreateProfessionAsync(CreateProfessionDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var existsByName = await _context.Professions
            .AnyAsync(p => p.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (existsByName)
            throw new DuplicateProfessionException(dto.Name);

        var existsByCode = await _context.Professions
            .AnyAsync(p => p.Code.ToLower() == dto.Code.ToLower(), cancellationToken);
        
        if (existsByCode)
            throw new DuplicateProfessionException($"Code '{dto.Code}' already exists");

        var profession = new Profession
        {
            Name = dto.Name,
            Code = dto.Code,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder,
            IsApproved = true,
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
            Code = profession.Code,
            Description = profession.Description,
            ProfessionTypesCount = 0
        };
    }

    public async Task<IEnumerable<ProfessionManagementDto>> GetAllProfessionsForManagementAsync(CancellationToken cancellationToken = default)
    {
        var professions = await _context.Professions
            .AsNoTracking()
            .Include(p => p.CreatedBy)
            .Include(p => p.ProfessionTypes)
            .OrderBy(p => p.IsApproved)
            .ThenBy(p => p.DisplayOrder)
            .ThenByDescending(p => p.CreatedAt)
            .Select(p => new ProfessionManagementDto
            {
                Id = p.Id,
                Name = p.Name,
                Code = p.Code,
                Description = p.Description,
                DisplayOrder = p.DisplayOrder,
                IsApproved = p.IsApproved,
                CreatedByUserId = p.CreatedByUserId,
                CreatedByUserName = p.CreatedBy != null 
                    ? $"{p.CreatedBy.FirstName} {p.CreatedBy.LastName}" 
                    : "System",
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                RejectionReason = p.RejectionReason,
                ProfessionTypesCount = p.ProfessionTypes.Count
            })
            .ToListAsync(cancellationToken);

        return professions;
    }

    public async Task<ProfessionManagementDto> UpdateProfessionAsync(int id, UpdateProfessionDto dto, CancellationToken cancellationToken = default)
    {
        var profession = await _context.Professions
            .Include(p => p.CreatedBy)
            .Include(p => p.ProfessionTypes)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        
        if (profession == null)
            throw new ProfessionNotFoundException(id);
        
        var existingWithSameName = await _context.Professions
            .AnyAsync(p => p.Id != id && p.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (existingWithSameName)
            throw new DuplicateProfessionException(dto.Name);

        var existingWithSameCode = await _context.Professions
            .AnyAsync(p => p.Id != id && p.Code.ToLower() == dto.Code.ToLower(), cancellationToken);
        
        if (existingWithSameCode)
            throw new DuplicateProfessionException($"Code '{dto.Code}' already exists");
        
        profession.Name = dto.Name;
        profession.Code = dto.Code;
        profession.Description = dto.Description;
        profession.DisplayOrder = dto.DisplayOrder;
        profession.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        return new ProfessionManagementDto
        {
            Id = profession.Id,
            Name = profession.Name,
            Code = profession.Code,
            Description = profession.Description,
            DisplayOrder = profession.DisplayOrder,
            IsApproved = profession.IsApproved,
            CreatedByUserId = profession.CreatedByUserId,
            CreatedByUserName = profession.CreatedBy != null 
                ? $"{profession.CreatedBy.FirstName} {profession.CreatedBy.LastName}" 
                : "System",
            CreatedAt = profession.CreatedAt,
            UpdatedAt = profession.UpdatedAt,
            RejectionReason = profession.RejectionReason,
            ProfessionTypesCount = profession.ProfessionTypes.Count
        };
    }

    public async Task<ProfessionManagementDto> ApproveProfessionAsync(int id, ApproveProfessionDto dto, CancellationToken cancellationToken = default)
    {
        var profession = await _context.Professions
            .Include(p => p.CreatedBy)
            .Include(p => p.ProfessionTypes)
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
            Code = profession.Code,
            Description = profession.Description,
            DisplayOrder = profession.DisplayOrder,
            IsApproved = profession.IsApproved,
            CreatedByUserId = profession.CreatedByUserId,
            CreatedByUserName = profession.CreatedBy != null 
                ? $"{profession.CreatedBy.FirstName} {profession.CreatedBy.LastName}" 
                : "System",
            CreatedAt = profession.CreatedAt,
            UpdatedAt = profession.UpdatedAt,
            RejectionReason = profession.RejectionReason,
            ProfessionTypesCount = profession.ProfessionTypes.Count
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

    #endregion

    #region LicenseTypes

    public async Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesAsync(CancellationToken cancellationToken = default)
    {
        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Where(lt => lt.IsApproved)
            .OrderBy(lt => lt.Name)
            .Select(lt => new LicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Code = lt.Code,
                Description = lt.Description,
                IsStateSpecific = lt.IsStateSpecific
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }

    public async Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default)
    {
        // Get license types linked to any ProfessionType under this Profession
        var licenseTypes = await _context.ProfessionTypeLicenseRequirements
            .AsNoTracking()
            .Where(lr => lr.ProfessionType.ProfessionId == professionId && 
                        lr.ProfessionType.IsActive && 
                        lr.ProfessionType.IsApproved &&
                        lr.LicenseType.IsApproved)
            .Select(lr => lr.LicenseType)
            .Distinct()
            .OrderBy(lt => lt.Name)
            .Select(lt => new LicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Code = lt.Code,
                Description = lt.Description,
                IsStateSpecific = lt.IsStateSpecific
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }

    public async Task<LicenseTypeDto> CreateLicenseTypeAsync(CreateLicenseTypeDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var existsByName = await _context.LicenseTypes
            .AnyAsync(lt => lt.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (existsByName)
            throw new DuplicateLicenseTypeException(dto.Name, 0);

        var existsByCode = await _context.LicenseTypes
            .AnyAsync(lt => lt.Code.ToLower() == dto.Code.ToLower(), cancellationToken);
        
        if (existsByCode)
            throw new DuplicateLicenseTypeException($"Code '{dto.Code}' already exists", 0);
        
        var licenseType = new LicenseType
        {
            Name = dto.Name,
            Code = dto.Code,
            Description = dto.Description,
            IsStateSpecific = dto.IsStateSpecific,
            IsApproved = true,
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
            Code = licenseType.Code,
            Description = licenseType.Description,
            IsStateSpecific = licenseType.IsStateSpecific
        };
    }

    public async Task<IEnumerable<LicenseTypeManagementDto>> GetAllLicenseTypesForManagementAsync(CancellationToken cancellationToken = default)
    {
        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Include(lt => lt.CreatedBy)
            .Include(lt => lt.ProfessionTypeLicenseRequirements)
            .OrderBy(lt => lt.IsApproved)
            .ThenByDescending(lt => lt.CreatedAt)
            .Select(lt => new LicenseTypeManagementDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Code = lt.Code,
                Description = lt.Description,
                IsStateSpecific = lt.IsStateSpecific,
                IsApproved = lt.IsApproved,
                CreatedByUserId = lt.CreatedByUserId,
                CreatedByUserName = lt.CreatedBy != null 
                    ? $"{lt.CreatedBy.FirstName} {lt.CreatedBy.LastName}" 
                    : "System",
                CreatedAt = lt.CreatedAt,
                UpdatedAt = lt.UpdatedAt,
                RejectionReason = lt.RejectionReason,
                UsageCount = lt.ProfessionTypeLicenseRequirements.Count
            })
            .ToListAsync(cancellationToken);

        return licenseTypes;
    }

    public async Task<LicenseTypeManagementDto> UpdateLicenseTypeAsync(int id, UpdateLicenseTypeDto dto, CancellationToken cancellationToken = default)
    {
        var licenseType = await _context.LicenseTypes
            .Include(lt => lt.CreatedBy)
            .Include(lt => lt.ProfessionTypeLicenseRequirements)
            .FirstOrDefaultAsync(lt => lt.Id == id, cancellationToken);
        
        if (licenseType == null)
            throw new LicenseTypeNotFoundException(id);
        
        var existingWithSameName = await _context.LicenseTypes
            .AnyAsync(lt => lt.Id != id && lt.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (existingWithSameName)
            throw new DuplicateLicenseTypeException(dto.Name, 0);

        var existingWithSameCode = await _context.LicenseTypes
            .AnyAsync(lt => lt.Id != id && lt.Code.ToLower() == dto.Code.ToLower(), cancellationToken);
        
        if (existingWithSameCode)
            throw new DuplicateLicenseTypeException($"Code '{dto.Code}' already exists", 0);
        
        licenseType.Name = dto.Name;
        licenseType.Code = dto.Code;
        licenseType.Description = dto.Description;
        licenseType.IsStateSpecific = dto.IsStateSpecific;
        licenseType.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        return new LicenseTypeManagementDto
        {
            Id = licenseType.Id,
            Name = licenseType.Name,
            Code = licenseType.Code,
            Description = licenseType.Description,
            IsStateSpecific = licenseType.IsStateSpecific,
            IsApproved = licenseType.IsApproved,
            CreatedByUserId = licenseType.CreatedByUserId,
            CreatedByUserName = licenseType.CreatedBy != null 
                ? $"{licenseType.CreatedBy.FirstName} {licenseType.CreatedBy.LastName}" 
                : "System",
            CreatedAt = licenseType.CreatedAt,
            UpdatedAt = licenseType.UpdatedAt,
            RejectionReason = licenseType.RejectionReason,
            UsageCount = licenseType.ProfessionTypeLicenseRequirements.Count
        };
    }

    public async Task<LicenseTypeManagementDto> ApproveLicenseTypeAsync(int id, ApproveLicenseTypeDto dto, CancellationToken cancellationToken = default)
    {
        var licenseType = await _context.LicenseTypes
            .Include(lt => lt.CreatedBy)
            .Include(lt => lt.ProfessionTypeLicenseRequirements)
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
                    "General", // No longer profession-specific
                    cancellationToken);
            }
            else
            {
                await _emailService.SendLicenseTypeRejectionNotificationAsync(
                    licenseType.CreatedBy.Email!,
                    $"{licenseType.CreatedBy.FirstName} {licenseType.CreatedBy.LastName}",
                    licenseType.Name,
                    "General",
                    dto.RejectionReason!,
                    cancellationToken);
            }
        }
        
        return new LicenseTypeManagementDto
        {
            Id = licenseType.Id,
            Name = licenseType.Name,
            Code = licenseType.Code,
            Description = licenseType.Description,
            IsStateSpecific = licenseType.IsStateSpecific,
            IsApproved = licenseType.IsApproved,
            CreatedByUserId = licenseType.CreatedByUserId,
            CreatedByUserName = licenseType.CreatedBy != null 
                ? $"{licenseType.CreatedBy.FirstName} {licenseType.CreatedBy.LastName}" 
                : "System",
            CreatedAt = licenseType.CreatedAt,
            UpdatedAt = licenseType.UpdatedAt,
            RejectionReason = licenseType.RejectionReason,
            UsageCount = licenseType.ProfessionTypeLicenseRequirements.Count
        };
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

    #endregion

    #region Export/Import

    public async Task<ExportDictionariesDto> ExportDictionariesAsync(string userId, CancellationToken cancellationToken = default)
    {
        var professions = await _context.Professions
            .AsNoTracking()
            .Where(p => p.IsApproved)
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Name)
            .Select(p => new ExportProfessionDto
            {
                Id = p.Id,
                Name = p.Name,
                Code = p.Code,
                Description = p.Description,
                DisplayOrder = p.DisplayOrder,
                IsActive = p.IsApproved
            })
            .ToListAsync(cancellationToken);

        var professionTypes = await _context.ProfessionTypes
            .AsNoTracking()
            .Include(pt => pt.Profession)
            .Where(pt => pt.IsActive && pt.IsApproved)
            .OrderBy(pt => pt.Profession.DisplayOrder)
            .ThenBy(pt => pt.DisplayOrder)
            .Select(pt => new ExportProfessionTypeDto
            {
                Id = pt.Id,
                Name = pt.Name,
                Code = pt.Code,
                Description = pt.Description,
                ProfessionId = pt.ProfessionId,
                ProfessionCode = pt.Profession.Code,
                RequiresStateLicense = pt.RequiresStateLicense,
                DisplayOrder = pt.DisplayOrder,
                IsActive = pt.IsActive
            })
            .ToListAsync(cancellationToken);

        var licenseTypes = await _context.LicenseTypes
            .AsNoTracking()
            .Where(lt => lt.IsApproved)
            .OrderBy(lt => lt.Name)
            .Select(lt => new ExportLicenseTypeDto
            {
                Id = lt.Id,
                Name = lt.Name,
                Code = lt.Code,
                Description = lt.Description,
                IsStateSpecific = lt.IsStateSpecific,
                IsActive = lt.IsApproved
            })
            .ToListAsync(cancellationToken);

        var licenseRequirements = await _context.ProfessionTypeLicenseRequirements
            .AsNoTracking()
            .Include(lr => lr.ProfessionType)
            .Include(lr => lr.LicenseType)
            .Select(lr => new ExportLicenseRequirementDto
            {
                Id = lr.Id,
                ProfessionTypeId = lr.ProfessionTypeId,
                ProfessionTypeCode = lr.ProfessionType.Code,
                LicenseTypeId = lr.LicenseTypeId,
                LicenseTypeCode = lr.LicenseType.Code,
                IsRequired = lr.IsRequired,
                Notes = lr.Notes
            })
            .ToListAsync(cancellationToken);

        return new ExportDictionariesDto
        {
            Professions = professions,
            ProfessionTypes = professionTypes,
            LicenseTypes = licenseTypes,
            LicenseRequirements = licenseRequirements
        };
    }

    public async Task<ImportResultDto> ImportDictionariesAsync(ImportDictionariesDto dto, CancellationToken cancellationToken = default)
    {
        var result = new ImportResultDto();

        ValidateImportData(dto, result);
        if (!result.Success)
            return result;

        // 1. Process Professions
        await ProcessProfessionsAsync(dto.Professions, result, cancellationToken);
        if (!result.Success)
            return result;
        await _context.SaveChangesAsync(cancellationToken);

        // 2. Process LicenseTypes
        await ProcessLicenseTypesAsync(dto.LicenseTypes, result, cancellationToken);
        if (!result.Success)
            return result;
        await _context.SaveChangesAsync(cancellationToken);

        // 3. Process ProfessionTypes
        await ProcessProfessionTypesAsync(dto.ProfessionTypes, result, cancellationToken);
        if (!result.Success)
            return result;
        await _context.SaveChangesAsync(cancellationToken);

        // 4. Process LicenseRequirements
        await ProcessLicenseRequirementsAsync(dto.LicenseRequirements, result, cancellationToken);
        if (result.Success)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        return result;
    }

    private void ValidateImportData(ImportDictionariesDto dto, ImportResultDto result)
    {
        // Validate Professions
        var professionCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var profession in dto.Professions)
        {
            if (string.IsNullOrWhiteSpace(profession.Name))
                result.Errors.Add("Profession name cannot be empty");
            if (string.IsNullOrWhiteSpace(profession.Code))
                result.Errors.Add($"Profession '{profession.Name}' must have a code");
            else if (!professionCodes.Add(profession.Code))
                result.Errors.Add($"Duplicate profession code: '{profession.Code}'");
        }

        // Validate LicenseTypes
        var licenseTypeCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var lt in dto.LicenseTypes)
        {
            if (string.IsNullOrWhiteSpace(lt.Name))
                result.Errors.Add("License type name cannot be empty");
            if (string.IsNullOrWhiteSpace(lt.Code))
                result.Errors.Add($"License type '{lt.Name}' must have a code");
            else if (!licenseTypeCodes.Add(lt.Code))
                result.Errors.Add($"Duplicate license type code: '{lt.Code}'");
        }

        // Validate ProfessionTypes
        var professionTypeCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var pt in dto.ProfessionTypes)
        {
            if (string.IsNullOrWhiteSpace(pt.Name))
                result.Errors.Add("Profession type name cannot be empty");
            if (string.IsNullOrWhiteSpace(pt.Code))
                result.Errors.Add($"Profession type '{pt.Name}' must have a code");
            if (string.IsNullOrWhiteSpace(pt.ProfessionCode) && !pt.ProfessionId.HasValue)
                result.Errors.Add($"Profession type '{pt.Name}' must have ProfessionCode or ProfessionId");
            
            var key = $"{pt.ProfessionCode ?? pt.ProfessionId?.ToString()}_{pt.Code}";
            if (!professionTypeCodes.Add(key))
                result.Errors.Add($"Duplicate profession type code: '{pt.Code}' in profession '{pt.ProfessionCode}'");
        }
    }

    private async Task ProcessProfessionsAsync(List<ImportProfessionDto> professions, ImportResultDto result, CancellationToken cancellationToken)
    {
        foreach (var dto in professions)
        {
            if (dto.Id.HasValue)
            {
                var existing = await _context.Professions.FindAsync([dto.Id.Value], cancellationToken);
                if (existing == null)
                {
                    result.Errors.Add($"Profession ID {dto.Id} not found");
                    continue;
                }

                existing.Name = dto.Name;
                existing.Code = dto.Code;
                existing.Description = dto.Description ?? string.Empty;
                existing.DisplayOrder = dto.DisplayOrder ?? 0;
                existing.IsApproved = dto.IsActive;
                existing.UpdatedAt = DateTime.UtcNow;
                result.ProfessionsUpdated++;
            }
            else
            {
                var duplicate = await _context.Professions
                    .FirstOrDefaultAsync(p => p.Code == dto.Code, cancellationToken);
                if (duplicate != null)
                {
                    result.Warnings.Add($"Profession with code '{dto.Code}' already exists, skipping");
                    continue;
                }

                var profession = new Profession
                {
                    Name = dto.Name,
                    Code = dto.Code,
                    Description = dto.Description ?? string.Empty,
                    DisplayOrder = dto.DisplayOrder ?? 0,
                    IsApproved = dto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Professions.Add(profession);
                result.ProfessionsCreated++;
            }
        }
    }

    private async Task ProcessLicenseTypesAsync(List<ImportLicenseTypeDto> licenseTypes, ImportResultDto result, CancellationToken cancellationToken)
    {
        foreach (var dto in licenseTypes)
        {
            if (dto.Id.HasValue)
            {
                var existing = await _context.LicenseTypes.FindAsync([dto.Id.Value], cancellationToken);
                if (existing == null)
                {
                    result.Errors.Add($"License type ID {dto.Id} not found");
                    continue;
                }

                existing.Name = dto.Name;
                existing.Code = dto.Code;
                existing.Description = dto.Description ?? string.Empty;
                existing.IsStateSpecific = dto.IsStateSpecific;
                existing.IsApproved = dto.IsActive;
                existing.UpdatedAt = DateTime.UtcNow;
                result.LicenseTypesUpdated++;
            }
            else
            {
                var duplicate = await _context.LicenseTypes
                    .FirstOrDefaultAsync(lt => lt.Code == dto.Code, cancellationToken);
                if (duplicate != null)
                {
                    result.Warnings.Add($"License type with code '{dto.Code}' already exists, skipping");
                    continue;
                }

                var licenseType = new LicenseType
                {
                    Name = dto.Name,
                    Code = dto.Code,
                    Description = dto.Description ?? string.Empty,
                    IsStateSpecific = dto.IsStateSpecific,
                    IsApproved = dto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.LicenseTypes.Add(licenseType);
                result.LicenseTypesCreated++;
            }
        }
    }

    private async Task ProcessProfessionTypesAsync(List<ImportProfessionTypeDto> professionTypes, ImportResultDto result, CancellationToken cancellationToken)
    {
        foreach (var dto in professionTypes)
        {
            int professionId;
            if (dto.ProfessionId.HasValue)
            {
                professionId = dto.ProfessionId.Value;
            }
            else
            {
                var profession = await _context.Professions
                    .FirstOrDefaultAsync(p => p.Code == dto.ProfessionCode, cancellationToken);
                if (profession == null)
                {
                    result.Errors.Add($"Profession with code '{dto.ProfessionCode}' not found for profession type '{dto.Name}'");
                    continue;
                }
                professionId = profession.Id;
            }

            if (dto.Id.HasValue)
            {
                var existing = await _context.ProfessionTypes.FindAsync([dto.Id.Value], cancellationToken);
                if (existing == null)
                {
                    result.Errors.Add($"Profession type ID {dto.Id} not found");
                    continue;
                }

                existing.Name = dto.Name;
                existing.Code = dto.Code;
                existing.Description = dto.Description ?? string.Empty;
                existing.ProfessionId = professionId;
                existing.RequiresStateLicense = dto.RequiresStateLicense;
                existing.DisplayOrder = dto.DisplayOrder ?? 0;
                existing.IsActive = dto.IsActive;
                existing.UpdatedAt = DateTime.UtcNow;
                result.ProfessionTypesUpdated++;
            }
            else
            {
                var duplicate = await _context.ProfessionTypes
                    .FirstOrDefaultAsync(pt => pt.ProfessionId == professionId && pt.Code == dto.Code, cancellationToken);
                if (duplicate != null)
                {
                    result.Warnings.Add($"Profession type with code '{dto.Code}' already exists in profession, skipping");
                    continue;
                }

                var professionType = new ProfessionType
                {
                    Name = dto.Name,
                    Code = dto.Code,
                    Description = dto.Description ?? string.Empty,
                    ProfessionId = professionId,
                    RequiresStateLicense = dto.RequiresStateLicense,
                    DisplayOrder = dto.DisplayOrder ?? 0,
                    IsActive = dto.IsActive,
                    IsApproved = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ProfessionTypes.Add(professionType);
                result.ProfessionTypesCreated++;
            }
        }
    }

    private async Task ProcessLicenseRequirementsAsync(List<ImportLicenseRequirementDto> requirements, ImportResultDto result, CancellationToken cancellationToken)
    {
        foreach (var dto in requirements)
        {
            var professionType = await _context.ProfessionTypes
                .FirstOrDefaultAsync(pt => pt.Code == dto.ProfessionTypeCode, cancellationToken);
            if (professionType == null)
            {
                result.Errors.Add($"Profession type with code '{dto.ProfessionTypeCode}' not found");
                continue;
            }

            var licenseType = await _context.LicenseTypes
                .FirstOrDefaultAsync(lt => lt.Code == dto.LicenseTypeCode, cancellationToken);
            if (licenseType == null)
            {
                result.Errors.Add($"License type with code '{dto.LicenseTypeCode}' not found");
                continue;
            }

            var existing = await _context.ProfessionTypeLicenseRequirements
                .FirstOrDefaultAsync(lr => lr.ProfessionTypeId == professionType.Id && 
                                          lr.LicenseTypeId == licenseType.Id, cancellationToken);
            if (existing != null)
            {
                existing.IsRequired = dto.IsRequired;
                existing.Notes = dto.Notes;
                result.LicenseRequirementsUpdated++;
            }
            else
            {
                var requirement = new ProfessionTypeLicenseRequirement
                {
                    ProfessionTypeId = professionType.Id,
                    LicenseTypeId = licenseType.Id,
                    IsRequired = dto.IsRequired,
                    Notes = dto.Notes
                };

                _context.ProfessionTypeLicenseRequirements.Add(requirement);
                result.LicenseRequirementsCreated++;
            }
        }
    }

    #endregion
}
