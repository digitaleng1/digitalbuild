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

            // 2. Combine all users (admins + clients + providers) into a single list
            var allUsersToCreate = new List<UserConfig>();
            
            // Add admins
            allUsersToCreate.AddRange(dbInitSettings.Users);
            
            // Add clients as UserConfig
            allUsersToCreate.AddRange(dbInitSettings.Clients.Select(c => new UserConfig
            {
                Id = c.Id,
                Email = c.Email,
                Password = c.Password,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Role = c.Role,
                PhoneNumber = c.PhoneNumber,
                ProfilePictureUrl = c.ProfilePictureUrl,
                Biography = c.Biography,
                Location = c.Location
            }));
            
            // Add providers as UserConfig
            allUsersToCreate.AddRange(dbInitSettings.Providers.Select(p => new UserConfig
            {
                Id = p.Id,
                Email = p.Email,
                Password = p.Password,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Role = p.Role,
                PhoneNumber = p.PhoneNumber,
                ProfilePictureUrl = p.ProfilePictureUrl,
                Biography = p.Biography,
                Location = p.Location,
                Website = p.Website
            }));

            // Seed all users at once
            var seededUsers = await UniversalUserSeeder.SeedAsync(userManager, allUsersToCreate, logger);

            // 3. Seed CSI Trade Categories (Professions, ProfessionTypes, LicenseTypes, Requirements)
            await CsiTradeSeeder.SeedAsync(context, dbInitSettings.CsiTrade, logger);

            // 4. Get license types from DB for other seeders
            var licenseTypes = await context.LicenseTypes.ToListAsync();

            // 5. Seed client details if clients exist in config
            if (dbInitSettings.Clients.Count > 0)
            {
                var clientUsers = seededUsers.Where(u => dbInitSettings.Clients.Any(c => c.Email == u.Email)).ToList();
                await ClientSeeder.SeedAsync(context, clientUsers, logger);
            }

            // 6. Seed provider specialists if providers exist in config
            var specialists = new List<Infrastructure.Entities.Specialist>();
            if (dbInitSettings.Providers.Count > 0)
            {
                var providerUsers = seededUsers.Where(u => dbInitSettings.Providers.Any(p => p.Email == u.Email)).ToList();
                specialists = await SpecialistSeeder.SeedAsync(
                    context,
                    providerUsers,
                    licenseTypes,
                    dbInitSettings.Providers,
                    logger);
            }

            // 7. Seed projects if they exist in config
            if (dbInitSettings.Projects.Count > 0)
            {
                var clientUsers = seededUsers.Where(u => dbInitSettings.Clients.Any(c => c.Email == u.Email)).ToList();
                var seededProjects = await ProjectSeeder.SeedAsync(
                    context,
                    clientUsers,
                    licenseTypes,
                    dbInitSettings.Projects,
                    logger);

                // 8. Seed bids only if we have both projects and specialists
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
