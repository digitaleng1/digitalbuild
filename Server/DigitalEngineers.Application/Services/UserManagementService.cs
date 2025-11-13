using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DigitalEngineers.Application.Services;

public class UserManagementService : IUserManagementService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserManagementService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IEnumerable<UserManagementDto>> GetUsersByRoleAsync(string role, CancellationToken cancellationToken = default)
    {
        var usersInRole = await _userManager.GetUsersInRoleAsync(role);

        var userDtos = new List<UserManagementDto>();

        foreach (var user in usersInRole)
        {
            var roles = await _userManager.GetRolesAsync(user);
            
            string? licenseStatus = null;
            if (role == "Provider")
            {
                var specialist = await _context.Specialists
                    .Include(s => s.LicenseTypes)
                    .FirstOrDefaultAsync(s => s.UserId == user.Id, cancellationToken);

                if (specialist != null && specialist.LicenseTypes.Any())
                {
                    var hasApproved = specialist.LicenseTypes.Any(lt => lt.Status == Domain.Enums.LicenseRequestStatus.Approved);
                    var hasPending = specialist.LicenseTypes.Any(lt => lt.Status == Domain.Enums.LicenseRequestStatus.Pending);
                    
                    if (hasApproved)
                        licenseStatus = "Active";
                    else if (hasPending)
                        licenseStatus = "Pending";
                    else
                        licenseStatus = "None";
                }
                else
                {
                    licenseStatus = "None";
                }
            }
            
            userDtos.Add(new UserManagementDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = user.ProfilePictureUrl,
                Roles = roles,
                IsActive = user.IsActive,
                LastActive = user.LastActive,
                CreatedAt = user.CreatedAt,
                LicenseStatus = licenseStatus
            });
        }

        return userDtos.OrderByDescending(u => u.CreatedAt);
    }

    public async Task<bool> ToggleUserStatusAsync(string userId, bool isActive, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        user.IsActive = isActive;
        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }
}
