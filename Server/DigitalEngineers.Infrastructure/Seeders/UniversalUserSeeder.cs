using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class UniversalUserSeeder
{
    public static async Task<List<ApplicationUser>> SeedAsync(
        UserManager<ApplicationUser> userManager,
        List<UserConfig> userConfigs,
        ILogger logger)
    {
        var createdUsers = new List<ApplicationUser>();

        foreach (var config in userConfigs)
        {
            var existingUser = await userManager.FindByEmailAsync(config.Email);
            if (existingUser != null)
            {
                createdUsers.Add(existingUser);
                continue;
            }

            var user = new ApplicationUser
            {
                Id = config.Id,
                UserName = config.Email,
                Email = config.Email,
                EmailConfirmed = true,
                FirstName = config.FirstName,
                LastName = config.LastName,
                PhoneNumber = config.PhoneNumber,
                ProfilePictureUrl = config.ProfilePictureUrl,
                Biography = config.Biography,
                Location = config.Location,
                Website = config.Website,
                CreatedAt = DateTime.UtcNow.AddMonths(-Random.Shared.Next(1, 12)),
                UpdatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30)),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48)),
                IsActive = true
            };

            var result = await userManager.CreateAsync(user, config.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, config.Role);
                createdUsers.Add(user);
            }
            else
            {
                logger.LogError("Failed to create user {Email}: {Errors}",
                    config.Email,
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        return createdUsers;
    }
}
