using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface IUserManagementService
{
    Task<IEnumerable<UserManagementDto>> GetUsersByRoleAsync(string role, CancellationToken cancellationToken = default);
    Task<bool> ToggleUserStatusAsync(string userId, bool isActive, CancellationToken cancellationToken = default);
}
