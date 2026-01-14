using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IUserManagementService
{
    Task<IEnumerable<UserManagementDto>> GetUsersByRoleAsync(string role, CancellationToken cancellationToken = default);
    Task<bool> ToggleUserStatusAsync(string userId, bool isActive, CancellationToken cancellationToken = default);
    Task<UserManagementDto> CreateAdminAsync(CreateAdminDto dto, CancellationToken cancellationToken = default);
    Task<UserManagementDto> CreateClientAsync(CreateClientDto dto, CancellationToken cancellationToken = default);
    Task<UserManagementDto> CreateSpecialistAsync(CreateSpecialistByAdminDto dto, CancellationToken cancellationToken = default);
}
