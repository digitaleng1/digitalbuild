using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class DataSeeder
{
    public static async Task SeedUsersAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        try
        {
            logger.LogInformation("Starting database migration...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migration completed successfully.");

            await SeedRolesAsync(roleManager);
            await SeedSuperAdminAsync(userManager);
            await SeedProvidersAsync(userManager);
            await SeedClientsAsync(userManager);
            await SeedlookupsDataAsync(context, logger);

            logger.LogInformation("Data seeding completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database migration or seeding.");
            throw;
        }
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = { "SuperAdmin", "Admin", "Client", "Provider" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private static async Task SeedSuperAdminAsync(UserManager<ApplicationUser> userManager)
    {
        var adminEmail = "admin@digitalengineers.com";
        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

        if (existingAdmin == null)
        {
            var admin = new ApplicationUser
            {
                Id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "Admin",
                LastName = "User",
                PhoneNumber = "555-000-0000",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/lego/1.jpg",
                Biography = "System administrator for Digital Engineers platform.",
                Location = "Remote",
                Website = "https://digitalengineers.com",
                IsAvailableForHire = false,
                CreatedAt = DateTime.UtcNow.AddYears(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                LastActive = DateTime.UtcNow,
                IsActive = true
            };

            var result = await userManager.CreateAsync(admin, "Admin123!@#");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "SuperAdmin");
            }
        }
    }

    private static async Task SeedProvidersAsync(UserManager<ApplicationUser> userManager)
    {
        var providers = new List<(string Id, string FirstName, string LastName, string Email, string Phone, 
            string ProfilePic, string Bio, string Location, string Website, int MonthsAgo, int UpdateDaysAgo)>
        {
            ("11111111-1111-1111-1111-111111111111", "John", "Smith", "john.smith@example.com", "555-123-4567",
                "https://randomuser.me/api/portraits/men/1.jpg",
                "Experienced civil engineer with over 10 years in infrastructure projects. Specialized in bridge design and construction management.",
                "New York, NY", "https://johnsmith-engineering.example.com", 12, 5),
            
            ("22222222-2222-2222-2222-222222222222", "Sarah", "Johnson", "sarah.johnson@example.com", "555-234-5678",
                "https://randomuser.me/api/portraits/women/2.jpg",
                "Architectural engineer specializing in sustainable building design. LEED certified with expertise in energy-efficient structures.",
                "San Francisco, CA", "https://sarahjohnson-architecture.example.com", 10, 2),
            
            ("33333333-3333-3333-3333-333333333333", "Michael", "Chen", "michael.chen@example.com", "555-345-6789",
                "https://randomuser.me/api/portraits/men/3.jpg",
                "Software engineer with focus on IoT solutions for smart infrastructure. Experience with embedded systems and cloud integration.",
                "Seattle, WA", "https://michaelchen-tech.example.com", 8, 14),
            
            ("44444444-4444-4444-4444-444444444444", "Emily", "Williams", "emily.williams@example.com", "555-456-7890",
                "https://randomuser.me/api/portraits/women/4.jpg",
                "Environmental engineer focused on water management and sustainability. Experienced in developing solutions for water conservation and treatment.",
                "Portland, OR", "https://emilywilliams-environmental.example.com", 6, 8),
            
            ("55555555-5555-5555-5555-555555555555", "David", "Rodriguez", "david.rodriguez@example.com", "555-567-8901",
                "https://randomuser.me/api/portraits/men/5.jpg",
                "Mechanical engineer specializing in renewable energy systems. Extensive experience in designing solar and wind power installations.",
                "Austin, TX", "https://davidrodriguez-energy.example.com", 9, 1),
            
            ("66666666-6666-6666-6666-666666666666", "Olivia", "Taylor", "olivia.taylor@example.com", "555-678-9012",
                "https://randomuser.me/api/portraits/women/6.jpg",
                "Electrical engineer with expertise in power systems and smart grid technologies. Focus on renewable energy integration.",
                "Boston, MA", "https://oliviataylor-electrical.example.com", 11, 22),
            
            ("77777777-7777-7777-7777-777777777777", "James", "Brown", "james.brown@example.com", "555-789-0123",
                "https://randomuser.me/api/portraits/men/7.jpg",
                "Civil engineer specializing in urban planning and transportation infrastructure. Experience working with city governments on public transit projects.",
                "Chicago, IL", "https://jamesbrown-civil.example.com", 7, 4),
            
            ("88888888-8888-8888-8888-888888888888", "Sophia", "Garcia", "sophia.garcia@example.com", "555-890-1234",
                "https://randomuser.me/api/portraits/women/8.jpg",
                "Structural engineer with focus on earthquake-resistant design. Experience working on high-rise buildings and public infrastructure in seismic zones.",
                "Los Angeles, CA", "https://sophiagarcia-structural.example.com", 5, 3),
            
            ("99999999-9999-9999-9999-999999999999", "William", "Miller", "william.miller@example.com", "555-901-2345",
                "https://randomuser.me/api/portraits/men/9.jpg",
                "Construction engineer with extensive experience in project management and site supervision. Specialized in commercial buildings and industrial facilities.",
                "Denver, CO", "https://williammiller-construction.example.com", 4, 10)
        };

        foreach (var (id, firstName, lastName, email, phone, profilePic, bio, location, website, monthsAgo, updateDaysAgo) in providers)
        {
            var existing = await userManager.FindByEmailAsync(email);
            if (existing == null)
            {
                var provider = new ApplicationUser
                {
                    Id = id,
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    FirstName = firstName,
                    LastName = lastName,
                    PhoneNumber = phone,
                    ProfilePictureUrl = profilePic,
                    Biography = bio,
                    Location = location,
                    Website = website,
                    IsAvailableForHire = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-monthsAgo),
                    UpdatedAt = DateTime.UtcNow.AddDays(-updateDaysAgo),
                    LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                    IsActive = true
                };

                var result = await userManager.CreateAsync(provider, "Provider123!@#");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(provider, "Provider");
                }
            }
        }
    }

    private static async Task SeedClientsAsync(UserManager<ApplicationUser> userManager)
    {
        var clients = new List<(string Id, string FirstName, string LastName, string Email, string Phone,
            string ProfilePic, string Bio, string Location, int MonthsAgo)>
        {
            ("c1111111-1111-1111-1111-111111111111", "Robert", "Anderson", "robert.anderson@example.com", "555-111-2222",
                "https://randomuser.me/api/portraits/men/10.jpg",
                "CEO of Anderson Construction looking for engineering partners for upcoming projects.",
                "New York, NY", 3),
            
            ("c2222222-2222-2222-2222-222222222222", "Jessica", "Martinez", "jessica.martinez@example.com", "555-222-3333",
                "https://randomuser.me/api/portraits/women/10.jpg",
                "Project manager seeking engineering consultants for residential development.",
                "Los Angeles, CA", 2),
            
            ("c3333333-3333-3333-3333-333333333333", "Daniel", "Thompson", "daniel.thompson@example.com", "555-333-4444",
                "https://randomuser.me/api/portraits/men/11.jpg",
                "Real estate developer looking for structural engineers for commercial projects.",
                "Chicago, IL", 5)
        };

        foreach (var (id, firstName, lastName, email, phone, profilePic, bio, location, monthsAgo) in clients)
        {
            var existing = await userManager.FindByEmailAsync(email);
            if (existing == null)
            {
                var client = new ApplicationUser
                {
                    Id = id,
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    FirstName = firstName,
                    LastName = lastName,
                    PhoneNumber = phone,
                    ProfilePictureUrl = profilePic,
                    Biography = bio,
                    Location = location,
                    IsAvailableForHire = false,
                    CreatedAt = DateTime.UtcNow.AddMonths(-monthsAgo),
                    UpdatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 10)),
                    LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48)),
                    IsActive = true
                };

                var result = await userManager.CreateAsync(client, "Client123!@#");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(client, "Client");
                }
            }
        }
    }

    private static async Task SeedlookupsDataAsync(ApplicationDbContext context, ILogger logger)
    {
        logger.LogInformation("Starting dictionary data seeding...");

        await SeedProfessionsAsync(context, logger);
        await SeedLicenseTypesAsync(context, logger);

        logger.LogInformation("Dictionary data seeding completed.");
    }

    private static async Task SeedProfessionsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Professions.AnyAsync())
        {
            logger.LogInformation("Professions already seeded. Skipping...");
            return;
        }

        var professions = new List<Profession>
        {
            new() { Name = "Engineering", Description = "Professional Engineer" },
            new() { Name = "Transportation Trades", Description = "Transportation" }
        };

        await context.Professions.AddRangeAsync(professions);
        await context.SaveChangesAsync();

        logger.LogInformation("Professions seeded successfully.");
    }

    private static async Task SeedLicenseTypesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.LicenseTypes.AnyAsync())
        {
            logger.LogInformation("License types already seeded. Skipping...");
            return;
        }

        // Get profession IDs from database
        var engineeringProfession = await context.Professions.FirstOrDefaultAsync(p => p.Name == "Engineering");
        var transportationProfession = await context.Professions.FirstOrDefaultAsync(p => p.Name == "Transportation Trades");

        if (engineeringProfession == null || transportationProfession == null)
        {
            logger.LogError("Cannot seed license types - professions not found");
            return;
        }

        var licenseTypes = new List<LicenseType>
        {
            new() { Name = "Agricultural and Biological Engineering", Description = "Agricultural and Biological Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Architectural Engineering", Description = "Architectural Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Chemical Engineering", Description = "Chemical Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Civil Engineering", Description = "Civil Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Control Systems Engineering", Description = "Control Systems Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Electrical and Computer Engineering", Description = "Electrical and Computer Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Environmental Engineering", Description = "Environmental Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Fire Protection Engineering", Description = "Fire Protection Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Industrial and Systems Engineering", Description = "Industrial and Systems Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Mechanical Engineering", Description = "Mechanical Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Metallurgical and Materials Engineering", Description = "Metallurgical and Materials Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Mining and Mineral Processing Engineering", Description = "Mining and Mineral Processing Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Naval Architecture and Marine Engineering", Description = "Naval Architecture and Marine Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Nuclear Engineering", Description = "Nuclear Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Petroleum Engineering", Description = "Petroleum Engineering", ProfessionId = engineeringProfession.Id },
            new() { Name = "Crane Operation", Description = "Crane Operation", ProfessionId = transportationProfession.Id },
            new() { Name = "Commercial Truck Driving", Description = "Commercial Truck Driving", ProfessionId = transportationProfession.Id }
        };

        await context.LicenseTypes.AddRangeAsync(licenseTypes);
        await context.SaveChangesAsync();

        logger.LogInformation("License types seeded successfully.");
    }
}
