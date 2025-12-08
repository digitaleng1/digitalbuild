using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class DataSeeder
{
    public static async System.Threading.Tasks.Task SeedUsersAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();
        var dbInitSettings = scope.ServiceProvider.GetRequiredService<IOptions<DbInitSettings>>().Value;

        try
        {
            await context.Database.MigrateAsync();

            // 1. Seed roles from config
            await RoleSeeder.SeedAsync(roleManager, dbInitSettings.Roles, logger);

            // 2. Seed all users from config (admin + test users)
            var seededUsers = await UniversalUserSeeder.SeedAsync(userManager, dbInitSettings.Users, logger);

            // 3. Seed professions and license types from config
            var seededLookups = await LookupSeeder.SeedAsync(
                context,
                dbInitSettings.Professions,
                dbInitSettings.LicenseTypes,
                logger);

            // 4. Seed client details if clients exist in config
            if (dbInitSettings.Clients.Count > 0)
            {
                var clientUsers = seededUsers.Where(u => dbInitSettings.Clients.Any(c => c.Email == u.Email)).ToList();
                await ClientSeeder.SeedAsync(context, clientUsers, logger);
            }

            // 5. Seed provider specialists if providers exist in config
            var specialists = new List<Infrastructure.Entities.Specialist>();
            if (dbInitSettings.Providers.Count > 0)
            {
                var providerUsers = seededUsers.Where(u => dbInitSettings.Providers.Any(p => p.Email == u.Email)).ToList();
                specialists = await SpecialistSeeder.SeedAsync(
                    context,
                    providerUsers,
                    seededLookups.LicenseTypes,
                    dbInitSettings.Providers,
                    logger);
            }

            // 6. Seed projects if they exist in config
            if (dbInitSettings.Projects.Count > 0)
            {
                var clientUsers = seededUsers.Where(u => dbInitSettings.Clients.Any(c => c.Email == u.Email)).ToList();
                var seededProjects = await ProjectSeeder.SeedAsync(
                    context,
                    clientUsers,
                    seededLookups.LicenseTypes,
                    dbInitSettings.Projects,
                    logger);

                // 7. Seed bids only if we have both projects and specialists
                if (specialists.Count > 0)
                {
                    var clientIds = clientUsers.Select(c => c.Id).ToArray();
                    await BidSeeder.SeedAsync(
                        context,
                        seededProjects.Projects,
                        specialists,
                        clientIds,
                        logger);
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database initialization");
            throw;
        }
    }
}
