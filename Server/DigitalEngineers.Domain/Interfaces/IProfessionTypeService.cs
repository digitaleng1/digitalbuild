using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IProfessionTypeService
{
    // Read operations
    Task<IEnumerable<ProfessionTypeDto>> GetProfessionTypesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ProfessionTypeDto>> GetProfessionTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProfessionTypeDetailDto>> GetAllProfessionTypesForManagementAsync(CancellationToken cancellationToken = default);
    Task<ProfessionTypeDetailDto> GetProfessionTypeByIdAsync(int id, CancellationToken cancellationToken = default);
    
    // Create operation
    Task<ProfessionTypeDetailDto> CreateProfessionTypeAsync(CreateProfessionTypeDto dto, CancellationToken cancellationToken = default);
    
    // Update operations
    Task<ProfessionTypeDetailDto> UpdateProfessionTypeAsync(int id, UpdateProfessionTypeDto dto, CancellationToken cancellationToken = default);
    
    // Delete operation
    Task DeleteProfessionTypeAsync(int id, CancellationToken cancellationToken = default);
    
    // License requirements management
    Task<IEnumerable<LicenseRequirementDto>> GetLicenseRequirementsAsync(int professionTypeId, CancellationToken cancellationToken = default);
    Task<LicenseRequirementDto> AddLicenseRequirementAsync(int professionTypeId, CreateLicenseRequirementDto dto, CancellationToken cancellationToken = default);
    Task<LicenseRequirementDto> UpdateLicenseRequirementAsync(int professionTypeId, int licenseTypeId, UpdateLicenseRequirementDto dto, CancellationToken cancellationToken = default);
    Task RemoveLicenseRequirementAsync(int professionTypeId, int licenseTypeId, CancellationToken cancellationToken = default);
}
