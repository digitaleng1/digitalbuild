using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IProfessionTypeService
{
    // Read operations
    Task<IEnumerable<ProfessionTypeDto>> GetProfessionTypesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ProfessionTypeDto>> GetProfessionTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default);
    Task<ProfessionTypeDetailDto?> GetProfessionTypeByIdAsync(int id, CancellationToken cancellationToken = default);
    
    // Create operation
    Task<ProfessionTypeDto> CreateProfessionTypeAsync(CreateProfessionTypeDto dto, string userId, CancellationToken cancellationToken = default);
    
    // Update operations
    Task<ProfessionTypeDto> UpdateProfessionTypeAsync(int id, UpdateProfessionTypeDto dto, CancellationToken cancellationToken = default);
    Task<ProfessionTypeDto> ApproveProfessionTypeAsync(int id, ApproveProfessionTypeDto dto, CancellationToken cancellationToken = default);
    
    // Delete operation
    Task DeleteProfessionTypeAsync(int id, CancellationToken cancellationToken = default);
    
    // License requirements management
    Task<LicenseRequirementDto> AddLicenseRequirementAsync(int professionTypeId, CreateLicenseRequirementDto dto, CancellationToken cancellationToken = default);
    Task<LicenseRequirementDto> UpdateLicenseRequirementAsync(int professionTypeId, int licenseTypeId, UpdateLicenseRequirementDto dto, CancellationToken cancellationToken = default);
    Task RemoveLicenseRequirementAsync(int professionTypeId, int licenseTypeId, CancellationToken cancellationToken = default);
}
