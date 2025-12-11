using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface ILookupService
{
    // Existing methods
    Task<IEnumerable<StateDto>> GetStatesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ProfessionDto>> GetProfessionsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default);
    
    // Client operations
    Task<ProfessionDto> CreateProfessionAsync(CreateProfessionDto dto, string userId, CancellationToken cancellationToken = default);
    Task<LicenseTypeDto> CreateLicenseTypeAsync(CreateLicenseTypeDto dto, string userId, CancellationToken cancellationToken = default);
    
    // Admin management
    Task<IEnumerable<ProfessionManagementDto>> GetAllProfessionsForManagementAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<LicenseTypeManagementDto>> GetAllLicenseTypesForManagementAsync(CancellationToken cancellationToken = default);
    Task<ProfessionManagementDto> UpdateProfessionAsync(int id, UpdateProfessionDto dto, CancellationToken cancellationToken = default);
    Task<LicenseTypeManagementDto> UpdateLicenseTypeAsync(int id, UpdateLicenseTypeDto dto, CancellationToken cancellationToken = default);
    Task<ProfessionManagementDto> ApproveProfessionAsync(int id, ApproveProfessionDto dto, CancellationToken cancellationToken = default);
    Task<LicenseTypeManagementDto> ApproveLicenseTypeAsync(int id, ApproveLicenseTypeDto dto, CancellationToken cancellationToken = default);
    Task DeleteProfessionAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteLicenseTypeAsync(int id, CancellationToken cancellationToken = default);
    
    // Import/Export
    Task<ExportDictionariesDto> ExportDictionariesAsync(string userId, CancellationToken cancellationToken = default);
    Task<ImportResultDto> ImportDictionariesAsync(ImportDictionariesDto dto, CancellationToken cancellationToken = default);
}
