using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface ISpecialistService
{
    Task<SpecialistDto> CreateSpecialistAsync(CreateSpecialistDto dto, CancellationToken cancellationToken = default);
    Task<SpecialistDetailsDto?> GetSpecialistByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<SpecialistDetailsDto?> GetSpecialistByUserIdAsync(string userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<SpecialistDto>> GetSpecialistsAsync(CancellationToken cancellationToken = default);
    Task<SpecialistDto> UpdateSpecialistAsync(int id, UpdateSpecialistDto dto, CancellationToken cancellationToken = default);
    Task DeleteSpecialistAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<SpecialistDto>> GetSpecialistsByLicenseTypeAsync(int licenseTypeId, CancellationToken cancellationToken = default);
    Task AssignSpecialistToProjectAsync(int projectId, int specialistId, string? role = null, CancellationToken cancellationToken = default);
    Task RemoveSpecialistFromProjectAsync(int projectId, int specialistId, CancellationToken cancellationToken = default);
    Task<IEnumerable<AvailableSpecialistDto>> GetSpecialistsByLicenseTypesAsync(int[] licenseTypeIds, CancellationToken cancellationToken = default);
}
