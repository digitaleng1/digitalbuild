using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class DataSeeder
{
    public static async System.Threading.Tasks.Task SeedUsersAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        try
        {
            await context.Database.MigrateAsync();

            await RoleSeeder.SeedAsync(roleManager);

            var seededUsers = await UserSeeder.SeedAsync(userManager);

            var seededLookups = await LookupSeeder.SeedAsync(context, logger);

            await ClientSeeder.SeedAsync(context, seededUsers.Clients, logger);

#if DEBUG
            var specialists = await SpecialistSeeder.SeedAsync(
                context,
                seededUsers.Providers,
                seededLookups.LicenseTypes,
                logger
            );

            var seededProjects = await ProjectSeeder.SeedAsync(
                context,
                seededUsers.Clients,
                seededLookups.LicenseTypes,
                logger
            );

            await BidSeeder.SeedAsync(
                context,
                seededProjects.Projects,
                specialists,
                seededUsers.Clients.Select(c => c.Id).ToArray(),
                logger
            );
#endif
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database migration or seeding.");
            throw;
        }
    }
}
