using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Application.Services;

public class ProfessionTypeService : IProfessionTypeService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProfessionTypeService> _logger;

    public ProfessionTypeService(
        ApplicationDbContext context,
        ILogger<ProfessionTypeService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ProfessionTypeDto>> GetProfessionTypesAsync(CancellationToken cancellationToken = default)
    {
        var professionTypes = await _context.ProfessionTypes
            .AsNoTracking()
            .Include(pt => pt.Profession)
            .Include(pt => pt.LicenseRequirements)
            .Where(pt => pt.IsActive && pt.IsApproved)
            .OrderBy(pt => pt.Profession.DisplayOrder)
            .ThenBy(pt => pt.DisplayOrder)
            .ThenBy(pt => pt.Name)
            .Select(pt => new ProfessionTypeDto
            {
                Id = pt.Id,
                Name = pt.Name,
                Code = pt.Code,
                Description = pt.Description,
                ProfessionId = pt.ProfessionId,
                ProfessionName = pt.Profession.Name,
                ProfessionCode = pt.Profession.Code,
                RequiresStateLicense = pt.RequiresStateLicense,
                DisplayOrder = pt.DisplayOrder,
                IsActive = pt.IsActive,
                LicenseRequirementsCount = pt.LicenseRequirements.Count
            })
            .ToListAsync(cancellationToken);

        return professionTypes;
    }

    public async Task<IEnumerable<ProfessionTypeDto>> GetProfessionTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default)
    {
        var professionTypes = await _context.ProfessionTypes
            .AsNoTracking()
            .Include(pt => pt.Profession)
            .Include(pt => pt.LicenseRequirements)
            .Where(pt => pt.ProfessionId == professionId && pt.IsActive && pt.IsApproved)
            .OrderBy(pt => pt.DisplayOrder)
            .ThenBy(pt => pt.Name)
            .Select(pt => new ProfessionTypeDto
            {
                Id = pt.Id,
                Name = pt.Name,
                Code = pt.Code,
                Description = pt.Description,
                ProfessionId = pt.ProfessionId,
                ProfessionName = pt.Profession.Name,
                ProfessionCode = pt.Profession.Code,
                RequiresStateLicense = pt.RequiresStateLicense,
                DisplayOrder = pt.DisplayOrder,
                IsActive = pt.IsActive,
                LicenseRequirementsCount = pt.LicenseRequirements.Count
            })
            .ToListAsync(cancellationToken);

        return professionTypes;
    }

    public async Task<ProfessionTypeDetailDto> GetProfessionTypeByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var professionType = await _context.ProfessionTypes
            .AsNoTracking()
            .Include(pt => pt.Profession)
            .Include(pt => pt.CreatedBy)
            .Include(pt => pt.LicenseRequirements)
                .ThenInclude(lr => lr.LicenseType)
            .FirstOrDefaultAsync(pt => pt.Id == id, cancellationToken);

        if (professionType == null)
            throw new ProfessionTypeNotFoundException(id);

        return new ProfessionTypeDetailDto
        {
            Id = professionType.Id,
            Name = professionType.Name,
            Code = professionType.Code,
            Description = professionType.Description,
            ProfessionId = professionType.ProfessionId,
            ProfessionName = professionType.Profession.Name,
            ProfessionCode = professionType.Profession.Code,
            RequiresStateLicense = professionType.RequiresStateLicense,
            DisplayOrder = professionType.DisplayOrder,
            IsActive = professionType.IsActive,
            IsApproved = professionType.IsApproved,
            CreatedByUserId = professionType.CreatedByUserId,
            CreatedByUserName = professionType.CreatedBy != null
                ? $"{professionType.CreatedBy.FirstName} {professionType.CreatedBy.LastName}"
                : null,
            CreatedAt = professionType.CreatedAt,
            UpdatedAt = professionType.UpdatedAt,
            RejectionReason = professionType.RejectionReason,
            LicenseRequirements = professionType.LicenseRequirements
                .Select(lr => new LicenseRequirementDto
                {
                    Id = lr.Id,
                    ProfessionTypeId = lr.ProfessionTypeId,
                    LicenseTypeId = lr.LicenseTypeId,
                    LicenseTypeName = lr.LicenseType.Name,
                    LicenseTypeCode = lr.LicenseType.Code,
                    IsRequired = lr.IsRequired,
                    IsStateSpecific = lr.LicenseType.IsStateSpecific,
                    Notes = lr.Notes
                })
                .ToList()
        };
    }

    public async Task<IEnumerable<ProfessionTypeDetailDto>> GetAllProfessionTypesForManagementAsync(CancellationToken cancellationToken = default)
    {
        var professionTypes = await _context.ProfessionTypes
            .AsNoTracking()
            .Include(pt => pt.Profession)
            .Include(pt => pt.CreatedBy)
            .Include(pt => pt.LicenseRequirements)
            .OrderBy(pt => pt.Profession.DisplayOrder)
            .ThenBy(pt => pt.DisplayOrder)
            .ThenBy(pt => pt.Name)
            .Select(pt => new ProfessionTypeDetailDto
            {
                Id = pt.Id,
                Name = pt.Name,
                Code = pt.Code,
                Description = pt.Description,
                ProfessionId = pt.ProfessionId,
                ProfessionName = pt.Profession.Name,
                ProfessionCode = pt.Profession.Code,
                RequiresStateLicense = pt.RequiresStateLicense,
                DisplayOrder = pt.DisplayOrder,
                IsActive = pt.IsActive,
                IsApproved = pt.IsApproved,
                CreatedByUserId = pt.CreatedByUserId,
                CreatedByUserName = pt.CreatedBy != null
                    ? $"{pt.CreatedBy.FirstName} {pt.CreatedBy.LastName}"
                    : "System",
                CreatedAt = pt.CreatedAt,
                UpdatedAt = pt.UpdatedAt,
                RejectionReason = pt.RejectionReason,
                LicenseRequirements = pt.LicenseRequirements
                    .Select(lr => new LicenseRequirementDto
                    {
                        Id = lr.Id,
                        ProfessionTypeId = lr.ProfessionTypeId,
                        LicenseTypeId = lr.LicenseTypeId,
                        LicenseTypeName = lr.LicenseType.Name,
                        LicenseTypeCode = lr.LicenseType.Code,
                        IsRequired = lr.IsRequired,
                        IsStateSpecific = lr.LicenseType.IsStateSpecific,
                        Notes = lr.Notes
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return professionTypes;
    }

    public async Task<ProfessionTypeDetailDto> CreateProfessionTypeAsync(CreateProfessionTypeDto dto, CancellationToken cancellationToken = default)
    {
        var profession = await _context.Professions
            .FirstOrDefaultAsync(p => p.Id == dto.ProfessionId, cancellationToken);
        
        if (profession == null)
            throw new ProfessionNotFoundException(dto.ProfessionId);

        var existsByCode = await _context.ProfessionTypes
            .AnyAsync(pt => pt.ProfessionId == dto.ProfessionId && 
                           pt.Code.ToLower() == dto.Code.ToLower(), cancellationToken);
        
        if (existsByCode)
            throw new DuplicateProfessionTypeException(dto.Code, dto.ProfessionId);

        var existsByName = await _context.ProfessionTypes
            .AnyAsync(pt => pt.ProfessionId == dto.ProfessionId && 
                           pt.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (existsByName)
            throw new DuplicateProfessionTypeException(dto.Name, dto.ProfessionId);

        var professionType = new ProfessionType
        {
            Name = dto.Name,
            Code = dto.Code,
            Description = dto.Description,
            ProfessionId = dto.ProfessionId,
            RequiresStateLicense = dto.RequiresStateLicense,
            DisplayOrder = dto.DisplayOrder,
            IsActive = true,
            IsApproved = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ProfessionTypes.Add(professionType);
        await _context.SaveChangesAsync(cancellationToken);

        return new ProfessionTypeDetailDto
        {
            Id = professionType.Id,
            Name = professionType.Name,
            Code = professionType.Code,
            Description = professionType.Description,
            ProfessionId = professionType.ProfessionId,
            ProfessionName = profession.Name,
            ProfessionCode = profession.Code,
            RequiresStateLicense = professionType.RequiresStateLicense,
            DisplayOrder = professionType.DisplayOrder,
            IsActive = professionType.IsActive,
            IsApproved = professionType.IsApproved,
            CreatedByUserId = professionType.CreatedByUserId,
            CreatedByUserName = null,
            CreatedAt = professionType.CreatedAt,
            UpdatedAt = professionType.UpdatedAt,
            RejectionReason = professionType.RejectionReason,
            LicenseRequirements = []
        };
    }

    public async Task<ProfessionTypeDetailDto> UpdateProfessionTypeAsync(int id, UpdateProfessionTypeDto dto, CancellationToken cancellationToken = default)
    {
        var professionType = await _context.ProfessionTypes
            .Include(pt => pt.Profession)
            .Include(pt => pt.CreatedBy)
            .Include(pt => pt.LicenseRequirements)
                .ThenInclude(lr => lr.LicenseType)
            .FirstOrDefaultAsync(pt => pt.Id == id, cancellationToken);

        if (professionType == null)
            throw new ProfessionTypeNotFoundException(id);

        var existsByCode = await _context.ProfessionTypes
            .AnyAsync(pt => pt.Id != id && 
                           pt.ProfessionId == professionType.ProfessionId && 
                           pt.Code.ToLower() == dto.Code.ToLower(), cancellationToken);
        
        if (existsByCode)
            throw new DuplicateProfessionTypeException(dto.Code, professionType.ProfessionId);

        var existsByName = await _context.ProfessionTypes
            .AnyAsync(pt => pt.Id != id && 
                           pt.ProfessionId == professionType.ProfessionId && 
                           pt.Name.ToLower() == dto.Name.ToLower(), cancellationToken);
        
        if (existsByName)
            throw new DuplicateProfessionTypeException(dto.Name, professionType.ProfessionId);

        professionType.Name = dto.Name;
        professionType.Code = dto.Code;
        professionType.Description = dto.Description;
        professionType.RequiresStateLicense = dto.RequiresStateLicense;
        professionType.DisplayOrder = dto.DisplayOrder;
        professionType.IsActive = dto.IsActive;
        professionType.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new ProfessionTypeDetailDto
        {
            Id = professionType.Id,
            Name = professionType.Name,
            Code = professionType.Code,
            Description = professionType.Description,
            ProfessionId = professionType.ProfessionId,
            ProfessionName = professionType.Profession.Name,
            ProfessionCode = professionType.Profession.Code,
            RequiresStateLicense = professionType.RequiresStateLicense,
            DisplayOrder = professionType.DisplayOrder,
            IsActive = professionType.IsActive,
            IsApproved = professionType.IsApproved,
            CreatedByUserId = professionType.CreatedByUserId,
            CreatedByUserName = professionType.CreatedBy != null
                ? $"{professionType.CreatedBy.FirstName} {professionType.CreatedBy.LastName}"
                : "System",
            CreatedAt = professionType.CreatedAt,
            UpdatedAt = professionType.UpdatedAt,
            RejectionReason = professionType.RejectionReason,
            LicenseRequirements = professionType.LicenseRequirements
                .Select(lr => new LicenseRequirementDto
                {
                    Id = lr.Id,
                    ProfessionTypeId = lr.ProfessionTypeId,
                    LicenseTypeId = lr.LicenseTypeId,
                    LicenseTypeName = lr.LicenseType.Name,
                    LicenseTypeCode = lr.LicenseType.Code,
                    IsRequired = lr.IsRequired,
                    IsStateSpecific = lr.LicenseType.IsStateSpecific,
                    Notes = lr.Notes
                })
                .ToList()
        };
    }

    public async Task DeleteProfessionTypeAsync(int id, CancellationToken cancellationToken = default)
    {
        var professionType = await _context.ProfessionTypes
            .FirstOrDefaultAsync(pt => pt.Id == id, cancellationToken);

        if (professionType == null)
            throw new ProfessionTypeNotFoundException(id);

        _context.ProfessionTypes.Remove(professionType);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<LicenseRequirementDto>> GetLicenseRequirementsAsync(int professionTypeId, CancellationToken cancellationToken = default)
    {
        var professionTypeExists = await _context.ProfessionTypes
            .AnyAsync(pt => pt.Id == professionTypeId, cancellationToken);

        if (!professionTypeExists)
            throw new ProfessionTypeNotFoundException(professionTypeId);

        var requirements = await _context.ProfessionTypeLicenseRequirements
            .AsNoTracking()
            .Include(lr => lr.LicenseType)
            .Where(lr => lr.ProfessionTypeId == professionTypeId)
            .OrderBy(lr => lr.LicenseType.Name)
            .Select(lr => new LicenseRequirementDto
            {
                Id = lr.Id,
                ProfessionTypeId = lr.ProfessionTypeId,
                LicenseTypeId = lr.LicenseTypeId,
                LicenseTypeName = lr.LicenseType.Name,
                LicenseTypeCode = lr.LicenseType.Code,
                IsRequired = lr.IsRequired,
                IsStateSpecific = lr.LicenseType.IsStateSpecific,
                Notes = lr.Notes
            })
            .ToListAsync(cancellationToken);

        return requirements;
    }

    public async Task<LicenseRequirementDto> AddLicenseRequirementAsync(int professionTypeId, CreateLicenseRequirementDto dto, CancellationToken cancellationToken = default)
    {
        var professionType = await _context.ProfessionTypes
            .Include(pt => pt.Profession)
            .FirstOrDefaultAsync(pt => pt.Id == professionTypeId, cancellationToken);

        if (professionType == null)
            throw new ProfessionTypeNotFoundException(professionTypeId);

        var licenseType = await _context.LicenseTypes
            .FirstOrDefaultAsync(lt => lt.Id == dto.LicenseTypeId, cancellationToken);

        if (licenseType == null)
            throw new LicenseTypeNotFoundException(dto.LicenseTypeId);

        var exists = await _context.ProfessionTypeLicenseRequirements
            .AnyAsync(lr => lr.ProfessionTypeId == professionTypeId && 
                           lr.LicenseTypeId == dto.LicenseTypeId, cancellationToken);

        if (exists)
            throw new DuplicateLicenseRequirementException(
                professionTypeId, 
                dto.LicenseTypeId,
                professionType.Name,
                professionType.Code,
                licenseType.Name,
                licenseType.Code);

        var requirement = new ProfessionTypeLicenseRequirement
        {
            ProfessionTypeId = professionTypeId,
            LicenseTypeId = dto.LicenseTypeId,
            IsRequired = dto.IsRequired,
            Notes = dto.Notes
        };

        _context.ProfessionTypeLicenseRequirements.Add(requirement);
        await _context.SaveChangesAsync(cancellationToken);

        return new LicenseRequirementDto
        {
            Id = requirement.Id,
            ProfessionTypeId = requirement.ProfessionTypeId,
            LicenseTypeId = requirement.LicenseTypeId,
            LicenseTypeName = licenseType.Name,
            LicenseTypeCode = licenseType.Code,
            IsRequired = requirement.IsRequired,
            IsStateSpecific = licenseType.IsStateSpecific,
            Notes = requirement.Notes
        };
    }

    public async Task<LicenseRequirementDto> UpdateLicenseRequirementAsync(int professionTypeId, int licenseTypeId, UpdateLicenseRequirementDto dto, CancellationToken cancellationToken = default)
    {
        var requirement = await _context.ProfessionTypeLicenseRequirements
            .Include(lr => lr.LicenseType)
            .FirstOrDefaultAsync(lr => lr.ProfessionTypeId == professionTypeId && 
                                      lr.LicenseTypeId == licenseTypeId, cancellationToken);

        if (requirement == null)
            throw new LicenseRequirementNotFoundException(professionTypeId, licenseTypeId);

        requirement.IsRequired = dto.IsRequired;
        requirement.Notes = dto.Notes;

        await _context.SaveChangesAsync(cancellationToken);

        return new LicenseRequirementDto
        {
            Id = requirement.Id,
            ProfessionTypeId = requirement.ProfessionTypeId,
            LicenseTypeId = requirement.LicenseTypeId,
            LicenseTypeName = requirement.LicenseType.Name,
            LicenseTypeCode = requirement.LicenseType.Code,
            IsRequired = requirement.IsRequired,
            IsStateSpecific = requirement.LicenseType.IsStateSpecific,
            Notes = requirement.Notes
        };
    }

    public async Task RemoveLicenseRequirementAsync(int professionTypeId, int licenseTypeId, CancellationToken cancellationToken = default)
    {
        var requirement = await _context.ProfessionTypeLicenseRequirements
            .FirstOrDefaultAsync(lr => lr.ProfessionTypeId == professionTypeId && 
                                      lr.LicenseTypeId == licenseTypeId, cancellationToken);

        if (requirement == null)
            throw new LicenseRequirementNotFoundException(professionTypeId, licenseTypeId);

        _context.ProfessionTypeLicenseRequirements.Remove(requirement);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
