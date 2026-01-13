using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface ILicensesService
{
    Task<LicenseRequestDto> CreateLicenseRequestAsync(int specialistId, CreateLicenseRequestDto dto, CancellationToken cancellationToken = default);
    Task<IEnumerable<LicenseRequestDto>> GetSpecialistLicenseRequestsAsync(int specialistId, CancellationToken cancellationToken = default);
    Task<IEnumerable<LicenseRequestDto>> GetPendingLicenseRequestsAsync(CancellationToken cancellationToken = default);
    Task<LicenseRequestDto> GetLicenseRequestByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<LicenseRequestDto> ApproveLicenseRequestAsync(int specialistId, int licenseTypeId, int professionTypeId, string adminId, ReviewLicenseRequestDto dto, CancellationToken cancellationToken = default);
    Task<LicenseRequestDto> RejectLicenseRequestAsync(int specialistId, int licenseTypeId, int professionTypeId, string adminId, ReviewLicenseRequestDto dto, CancellationToken cancellationToken = default);
    Task<LicenseRequestDto> ResubmitLicenseRequestAsync(int specialistId, int licenseTypeId, int professionTypeId, ResubmitLicenseRequestDto dto, CancellationToken cancellationToken = default);
    Task DeleteLicenseRequestAsync(int id, int specialistId, CancellationToken cancellationToken = default);
}
