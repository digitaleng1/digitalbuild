using DigitalEngineers.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class RoleSeeder
{
    public static async Task SeedAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = UserRoles.ToArray();

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}
