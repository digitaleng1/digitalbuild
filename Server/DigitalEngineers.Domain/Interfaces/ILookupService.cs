using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface ILookupService
{
    Task<IEnumerable<StateDto>> GetStatesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ProfessionDto>> GetProfessionsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<LicenseTypeDto>> GetLicenseTypesByProfessionIdAsync(int professionId, CancellationToken cancellationToken = default);
}
