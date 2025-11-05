using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Domain.Enums;
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
            await context.Database.MigrateAsync();

            await SeedRolesAsync(roleManager);
            await SeedAdminsAsync(userManager);
            await SeedProvidersAsync(userManager);
            await SeedClientsAsync(userManager);
            await SeedlookupsDataAsync(context, logger);
            await SeedSpecialistsAsync(context, logger);
            await SeedProjectsAsync(context, logger);
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

    private static async Task SeedAdminsAsync(UserManager<ApplicationUser> userManager)
    {
        var superAdminEmail = "super.admin@digitalengineers.com";
        var existingSuperAdmin = await userManager.FindByEmailAsync(superAdminEmail);

        if (existingSuperAdmin == null)
        {
            var superAdmin = new ApplicationUser
            {
                Id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                UserName = superAdminEmail,
                Email = superAdminEmail,
                EmailConfirmed = true,
                FirstName = "Super",
                LastName = "Admin",
                PhoneNumber = "555-000-0000",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/lego/1.jpg",
                Biography = "System super administrator for Digital Engineers platform.",
                Location = "Remote",
                Website = "https://digitalengineers.com",
                IsAvailableForHire = false,
                CreatedAt = DateTime.UtcNow.AddYears(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                LastActive = DateTime.UtcNow,
                IsActive = true
            };

            var result = await userManager.CreateAsync(superAdmin, "SuperAdmin123!@#");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
            }
        }

        var adminEmail = "admin@digitalengineers.com";
        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

        if (existingAdmin == null)
        {
            var admin = new ApplicationUser
            {
                Id = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "Admin",
                LastName = "User",
                PhoneNumber = "555-000-0001",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/lego/2.jpg",
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
                await userManager.AddToRoleAsync(admin, "Admin");
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
        await SeedProfessionsAsync(context, logger);
        await SeedLicenseTypesAsync(context, logger);
    }

    private static async Task SeedProfessionsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Professions.AnyAsync())
        {
            return;
        }

        var professions = new List<Profession>
        {
            new() { Name = "Engineering", Description = "Professional Engineer" },
            new() { Name = "Transportation Trades", Description = "Transportation" }
        };

        await context.Professions.AddRangeAsync(professions);
        await context.SaveChangesAsync();
    }

    private static async Task SeedLicenseTypesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.LicenseTypes.AnyAsync())
        {
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
    }

    private static async Task SeedSpecialistsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Specialists.AnyAsync())
        {
            return;
        }

        var providerUserIds = new[]
        {
            "11111111-1111-1111-1111-111111111111",
            "22222222-2222-2222-2222-222222222222",
            "33333333-3333-3333-3333-333333333333",
            "44444444-4444-4444-4444-444444444444",
            "55555555-5555-5555-5555-555555555555",
            "66666666-6666-6666-6666-666666666666",
            "77777777-7777-7777-7777-777777777777",
            "88888888-8888-8888-8888-888888888888",
            "99999999-9999-9999-9999-999999999999"
        };

        var allLicenseTypes = await context.LicenseTypes.Select(lt => lt.Id).ToListAsync();
        
        if (allLicenseTypes.Count == 0)
        {
            logger.LogError("No license types found. Cannot seed specialists.");
            return;
        }

        var specialists = new List<Specialist>();
        var specialistLicenseTypes = new List<SpecialistLicenseType>();

        foreach (var userId in providerUserIds)
        {
            var specialist = new Specialist
            {
                UserId = userId,
                YearsOfExperience = Random.Shared.Next(2, 21),
                HourlyRate = Random.Shared.Next(50, 201),
                Rating = Math.Round(Random.Shared.NextDouble() * 2 + 3, 1),
                IsAvailable = true,
                Specialization = null,
                CreatedAt = DateTime.UtcNow.AddMonths(-Random.Shared.Next(6, 24)),
                UpdatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30))
            };

            specialists.Add(specialist);
        }

        await context.Specialists.AddRangeAsync(specialists);
        await context.SaveChangesAsync();

        foreach (var specialist in specialists)
        {
            var licenseCount = Random.Shared.Next(5, 11);
            var selectedLicenseIds = allLicenseTypes
                .OrderBy(_ => Random.Shared.Next())
                .Take(licenseCount)
                .ToList();

            foreach (var licenseId in selectedLicenseIds)
            {
                specialistLicenseTypes.Add(new SpecialistLicenseType
                {
                    SpecialistId = specialist.Id,
                    LicenseTypeId = licenseId
                });
            }
        }

        await context.SpecialistLicenseTypes.AddRangeAsync(specialistLicenseTypes);
        await context.SaveChangesAsync();

        logger.LogInformation("Seeded {SpecialistCount} specialists with random licenses (5-10 per specialist)", specialists.Count);
    }

    private static async Task SeedProjectsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Projects.AnyAsync())
        {
            return;
        }

        var clientIds = new[]
        {
            "c1111111-1111-1111-1111-111111111111", // Robert Anderson
            "c2222222-2222-2222-2222-222222222222", // Jessica Martinez
            "c3333333-3333-3333-3333-333333333333"  // Daniel Thompson
        };

        var specialists = await context.Specialists
            .Include(s => s.LicenseTypes)
            .ToListAsync();

        if (specialists.Count == 0)
        {
            logger.LogError("No specialists found. Cannot seed projects.");
            return;
        }

        var allLicenseTypes = await context.LicenseTypes.ToListAsync();
        if (allLicenseTypes.Count == 0)
        {
            logger.LogError("No license types found. Cannot seed projects.");
            return;
        }

        var projects = new List<Project>();
        var projectLicenseTypes = new List<ProjectLicenseType>();
        var projectFiles = new List<ProjectFile>();
        var bidRequests = new List<BidRequest>();
        var bidResponses = new List<BidResponse>();
        var projectSpecialists = new List<ProjectSpecialist>();
        var bidMessages = new List<BidMessage>();

        // Project 1: QuotePending - Residential House Foundation Repair
        var project1 = CreateProject(
            "Residential House Foundation Repair",
            "Foundation inspection and repair for a 2-story residential property. Cracks detected in basement walls, requires structural assessment and repair plan.",
            clientIds[0],
            "1425 Maple Street",
            "New York",
            "NY",
            "10001",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.QuotePending,
            DateTime.UtcNow.AddDays(-15)
        );
        projects.Add(project1);

        // Project 2: InProgress - Downtown Office HVAC Upgrade
        var project2 = CreateProject(
            "Downtown Office HVAC Upgrade",
            "Complete HVAC system replacement for 5-floor office building. Energy-efficient system with smart controls and zoned climate management.",
            clientIds[1],
            "850 Commerce Street",
            "Los Angeles",
            "CA",
            "90012",
            ProjectScope.LessThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-45)
        );
        projects.Add(project2);

        // Project 3: InProgress - Industrial Factory Electrical
        var project3 = CreateProject(
            "Industrial Factory Electrical System Upgrade",
            "High-voltage electrical system modernization for manufacturing facility. Includes power distribution, safety systems, and backup generators.",
            clientIds[2],
            "3200 Industrial Parkway",
            "Chicago",
            "IL",
            "60601",
            ProjectScope.GreaterThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-60)
        );
        projects.Add(project3);

        // Project 4: Completed - Apartment Complex Plumbing
        var project4 = CreateProject(
            "Apartment Complex Plumbing Renovation",
            "Complete plumbing system replacement for 50-unit apartment complex. New pipes, fixtures, and water-efficient systems installed.",
            clientIds[0],
            "725 Riverside Drive",
            "Austin",
            "TX",
            "78701",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.Completed,
            DateTime.UtcNow.AddDays(-120)
        );
        projects.Add(project4);

        // Project 5: InProgress - Shopping Mall Fire Safety System
        var project5 = CreateProject(
            "Shopping Mall Fire Safety System Installation",
            "Comprehensive fire protection system for new shopping mall. Includes sprinklers, alarms, emergency lighting, and fire suppression systems.",
            clientIds[1],
            "4500 Mall Boulevard",
            "Boston",
            "MA",
            "02101",
            ProjectScope.LessThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-30)
        );
        projects.Add(project5);

        // Project 6: QuotePending - Warehouse Structural Assessment
        var project6 = CreateProject(
            "Warehouse Structural Assessment and Reinforcement",
            "Structural integrity assessment for 100,000 sq ft warehouse. Potential load-bearing concerns, requires engineering evaluation and reinforcement plan.",
            clientIds[2],
            "9800 Logistics Way",
            "Denver",
            "CO",
            "80201",
            ProjectScope.GreaterThanSixMonths,
            ProjectStatus.QuotePending,
            DateTime.UtcNow.AddDays(-8)
        );
        projects.Add(project6);

        // Project 7: Cancelled - Townhouse Renovation Project
        var project7 = CreateProject(
            "Townhouse Renovation and Modernization",
            "Complete renovation of 4-unit townhouse complex. Structural modifications, updated MEP systems, and modern finishes. Project cancelled due to budget constraints.",
            clientIds[0],
            "1650 Oak Avenue",
            "Seattle",
            "WA",
            "98101",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.Cancelled,
            DateTime.UtcNow.AddDays(-90)
        );
        projects.Add(project7);

        // Project 8: InProgress - Hospital HVAC Modernization
        var project8 = CreateProject(
            "Hospital HVAC System Modernization",
            "Critical infrastructure upgrade for regional hospital. Advanced air filtration, isolation room capabilities, and energy-efficient climate control for medical facility.",
            clientIds[1],
            "2100 Medical Center Drive",
            "San Francisco",
            "CA",
            "94102",
            ProjectScope.GreaterThanSixMonths,
            ProjectStatus.InProgress,
            DateTime.UtcNow.AddDays(-75)
        );
        projects.Add(project8);

        // Project 9: Completed - Power Plant Safety Inspection
        var project9 = CreateProject(
            "Power Plant Safety and Compliance Inspection",
            "Comprehensive safety inspection and compliance audit for regional power generation facility. Structural integrity, electrical safety, and environmental compliance assessment completed.",
            clientIds[2],
            "7500 Energy Boulevard",
            "Portland",
            "OR",
            "97201",
            ProjectScope.LessThanSixMonths,
            ProjectStatus.Completed,
            DateTime.UtcNow.AddDays(-150)
        );
        projects.Add(project9);

        // Project 10: Draft - Luxury Villa Construction
        var project10 = CreateProject(
            "Luxury Villa Construction Engineering",
            "High-end residential construction project. Custom architectural design, advanced smart home systems, sustainable building practices, and premium finishes.",
            clientIds[0],
            "100 Oceanview Terrace",
            "Miami",
            "FL",
            "33101",
            ProjectScope.OneToThreeMonths,
            ProjectStatus.Draft,
            DateTime.UtcNow.AddDays(-5)
        );
        projects.Add(project10);

        await context.Projects.AddRangeAsync(projects);
        await context.SaveChangesAsync();

        // Seed ProjectLicenseTypes
        AddProjectLicenseTypes(projectLicenseTypes, project1.Id, allLicenseTypes, new[] { "Civil Engineering", "Architectural Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project2.Id, allLicenseTypes, new[] { "Mechanical Engineering", "Electrical and Computer Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project3.Id, allLicenseTypes, new[] { "Electrical and Computer Engineering", "Industrial and Systems Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project4.Id, allLicenseTypes, new[] { "Civil Engineering", "Environmental Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project5.Id, allLicenseTypes, new[] { "Fire Protection Engineering", "Electrical and Computer Engineering", "Mechanical Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project6.Id, allLicenseTypes, new[] { "Civil Engineering", "Architectural Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project7.Id, allLicenseTypes, new[] { "Architectural Engineering", "Civil Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project8.Id, allLicenseTypes, new[] { "Mechanical Engineering", "Electrical and Computer Engineering", "Fire Protection Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project9.Id, allLicenseTypes, new[] { "Electrical and Computer Engineering", "Environmental Engineering" });
        AddProjectLicenseTypes(projectLicenseTypes, project10.Id, allLicenseTypes, new[] { "Architectural Engineering", "Civil Engineering" });

        await context.ProjectLicenseTypes.AddRangeAsync(projectLicenseTypes);
        await context.SaveChangesAsync();

        // Seed ProjectFiles (fake S3 URLs)
        AddProjectFile(projectFiles, project1.Id, clientIds[0], "foundation_photos.zip", 15728640, "application/zip");
        AddProjectFile(projectFiles, project1.Id, clientIds[0], "inspection_report.pdf", 2097152, "application/pdf");

        AddProjectFile(projectFiles, project2.Id, clientIds[1], "hvac_blueprints.pdf", 5242880, "application/pdf");
        AddProjectFile(projectFiles, project2.Id, clientIds[1], "building_specs.docx", 1048576, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        AddProjectFile(projectFiles, project2.Id, clientIds[1], "current_system_photos.zip", 20971520, "application/zip");
        AddProjectFile(projectFiles, project2.Id, clientIds[1], "energy_audit.pdf", 3145728, "application/pdf");

        AddProjectFile(projectFiles, project3.Id, clientIds[2], "electrical_drawings.pdf", 10485760, "application/pdf");
        AddProjectFile(projectFiles, project3.Id, clientIds[2], "power_requirements.xlsx", 524288, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        AddProjectFile(projectFiles, project3.Id, clientIds[2], "site_survey.pdf", 4194304, "application/pdf");

        AddProjectFile(projectFiles, project4.Id, clientIds[0], "plumbing_plans.pdf", 6291456, "application/pdf");
        AddProjectFile(projectFiles, project4.Id, clientIds[0], "completion_photos.zip", 31457280, "application/zip");
        AddProjectFile(projectFiles, project4.Id, clientIds[0], "inspection_certificate.pdf", 1048576, "application/pdf");
        AddProjectFile(projectFiles, project4.Id, clientIds[0], "warranty_documents.pdf", 2097152, "application/pdf");
        AddProjectFile(projectFiles, project4.Id, clientIds[0], "as_built_drawings.pdf", 8388608, "application/pdf");

        AddProjectFile(projectFiles, project5.Id, clientIds[1], "fire_safety_plans.pdf", 7340032, "application/pdf");
        AddProjectFile(projectFiles, project5.Id, clientIds[1], "sprinkler_layout.pdf", 4194304, "application/pdf");
        AddProjectFile(projectFiles, project5.Id, clientIds[1], "alarm_system_specs.pdf", 2097152, "application/pdf");

        AddProjectFile(projectFiles, project6.Id, clientIds[2], "warehouse_photos.zip", 18874368, "application/zip");

        AddProjectFile(projectFiles, project7.Id, clientIds[0], "renovation_plans.pdf", 9437184, "application/pdf");
        AddProjectFile(projectFiles, project7.Id, clientIds[0], "cancellation_notice.pdf", 524288, "application/pdf");

        AddProjectFile(projectFiles, project8.Id, clientIds[1], "hospital_hvac_specs.pdf", 12582912, "application/pdf");
        AddProjectFile(projectFiles, project8.Id, clientIds[1], "medical_facility_requirements.pdf", 3145728, "application/pdf");
        AddProjectFile(projectFiles, project8.Id, clientIds[1], "isolation_room_specs.pdf", 2097152, "application/pdf");
        AddProjectFile(projectFiles, project8.Id, clientIds[1], "progress_photos_month2.zip", 26214400, "application/zip");

        AddProjectFile(projectFiles, project9.Id, clientIds[2], "inspection_checklist.pdf", 1572864, "application/pdf");
        AddProjectFile(projectFiles, project9.Id, clientIds[2], "compliance_report.pdf", 5242880, "application/pdf");
        AddProjectFile(projectFiles, project9.Id, clientIds[2], "final_assessment.pdf", 4194304, "application/pdf");

        AddProjectFile(projectFiles, project10.Id, clientIds[0], "villa_concept_drawings.pdf", 16777216, "application/pdf");
        AddProjectFile(projectFiles, project10.Id, clientIds[0], "smart_home_specifications.pdf", 3145728, "application/pdf");

        // Add thumbnails (using real image URLs)
        project1.ThumbnailUrl = "https://images.unsplash.com/photo-1477322524744-0eece9e79640?w=800&auto=format&fit=crop";
        project2.ThumbnailUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop";
        project3.ThumbnailUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop";
        project4.ThumbnailUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";
        project5.ThumbnailUrl = "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800&auto=format&fit=crop";
        project6.ThumbnailUrl = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop";
        project7.ThumbnailUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop";
        project8.ThumbnailUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop";
        project9.ThumbnailUrl = "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&auto=format&fit=crop";
        project10.ThumbnailUrl = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop";

        await context.ProjectFiles.AddRangeAsync(projectFiles);
        await context.SaveChangesAsync();

        // Seed BidRequests, BidResponses, ProjectSpecialists, BidMessages based on project status
        
        // Project 1: QuotePending (3 bids, no responses)
        AddBidRequest(bidRequests, project1.Id, specialists[0].Id, "Foundation Repair Bid", "Comprehensive foundation assessment and repair proposal", 25000m, project1.CreatedAt.AddDays(1));
        AddBidRequest(bidRequests, project1.Id, specialists[1].Id, "Structural Engineering Services", "Foundation inspection and repair engineering services", 22000m, project1.CreatedAt.AddDays(2));
        AddBidRequest(bidRequests, project1.Id, specialists[2].Id, "Foundation Repair Quote", "Professional foundation repair services with warranty", 28000m, project1.CreatedAt.AddDays(1));

        // Project 2: InProgress (5 bids, 3 responses, 2 specialists assigned)
        var bid2_1 = AddBidRequest(bidRequests, project2.Id, specialists[3].Id, "HVAC System Design", "Complete HVAC system design and installation", 185000m, project2.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid2_2 = AddBidRequest(bidRequests, project2.Id, specialists[4].Id, "Electrical Integration", "HVAC electrical systems integration", 45000m, project2.CreatedAt.AddDays(4), BidRequestStatus.Accepted);
        var bid2_3 = AddBidRequest(bidRequests, project2.Id, specialists[5].Id, "Energy Audit Services", "Building energy efficiency analysis", 15000m, project2.CreatedAt.AddDays(5), BidRequestStatus.Responded);
        AddBidRequest(bidRequests, project2.Id, specialists[6].Id, "HVAC Installation Bid", "Alternative HVAC solution proposal", 195000m, project2.CreatedAt.AddDays(3));
        AddBidRequest(bidRequests, project2.Id, specialists[7].Id, "Climate Control Systems", "Smart climate control implementation", 52000m, project2.CreatedAt.AddDays(6));

        var response2_1 = AddBidResponse(bidResponses, bid2_1, specialists[3].Id, "Experienced HVAC engineer with 15 years in commercial buildings. Proven track record with energy-efficient systems.", 185000m, 120, bid2_1.CreatedAt.AddDays(2));
        var response2_2 = AddBidResponse(bidResponses, bid2_2, specialists[4].Id, "Electrical systems specialist. Will ensure seamless integration with building infrastructure.", 45000m, 45, bid2_2.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid2_3, specialists[5].Id, "Certified energy auditor. Will provide detailed efficiency recommendations.", 15000m, 15, bid2_3.CreatedAt.AddDays(1));

        response2_1.AdminMarkupPercentage = 15m;
        response2_1.AdminComment = "Approved - excellent track record";
        response2_2.AdminMarkupPercentage = 12m;
        response2_2.AdminComment = "Approved - competitive pricing";

        AddProjectSpecialist(projectSpecialists, project2.Id, specialists[3].Id, project2.CreatedAt.AddDays(10), "Lead HVAC Engineer");
        AddProjectSpecialist(projectSpecialists, project2.Id, specialists[4].Id, project2.CreatedAt.AddDays(10), "Electrical Integration Specialist");

        AddBidMessage(bidMessages, response2_1, clientIds[1], "When can you start the installation phase?", response2_1.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, response2_1, specialists[3].UserId, "We can begin installation in 2 weeks after final approval.", response2_1.CreatedAt.AddDays(1).AddHours(3));
        AddBidMessage(bidMessages, response2_1, clientIds[1], "Perfect. Please provide the equipment list.", response2_1.CreatedAt.AddDays(2));
        AddBidMessage(bidMessages, response2_1, specialists[3].UserId, "Equipment list sent via email. All units are energy star rated.", response2_1.CreatedAt.AddDays(2).AddHours(4));

        AddBidMessage(bidMessages, response2_2, clientIds[1], "Will this include emergency backup power?", response2_2.CreatedAt.AddHours(5));
        AddBidMessage(bidMessages, response2_2, specialists[4].UserId, "Yes, backup generator integration is included in the scope.", response2_2.CreatedAt.AddHours(6));
        AddBidMessage(bidMessages, response2_2, clientIds[1], "Excellent. Please coordinate with the HVAC team.", response2_2.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, response2_2, specialists[4].UserId, "Already in contact. We have a joint timeline.", response2_2.CreatedAt.AddDays(1).AddHours(2));

        // Project 3: InProgress (4 bids, 4 responses, 3 specialists assigned)
        var bid3_1 = AddBidRequest(bidRequests, project3.Id, specialists[0].Id, "High Voltage Systems", "Industrial electrical infrastructure upgrade", 320000m, project3.CreatedAt.AddDays(5), BidRequestStatus.Accepted);
        var bid3_2 = AddBidRequest(bidRequests, project3.Id, specialists[1].Id, "Power Distribution Design", "Electrical distribution system engineering", 85000m, project3.CreatedAt.AddDays(6), BidRequestStatus.Accepted);
        var bid3_3 = AddBidRequest(bidRequests, project3.Id, specialists[2].Id, "Backup Generator Systems", "Emergency power systems installation", 95000m, project3.CreatedAt.AddDays(7), BidRequestStatus.Accepted);
        var bid3_4 = AddBidRequest(bidRequests, project3.Id, specialists[8].Id, "Safety Systems Integration", "Industrial safety and monitoring systems", 45000m, project3.CreatedAt.AddDays(8), BidRequestStatus.Responded);

        var response3_1 = AddBidResponse(bidResponses, bid3_1, specialists[0].Id, "20+ years in industrial electrical systems. Licensed for high-voltage work.", 320000m, 180, bid3_1.CreatedAt.AddDays(2));
        var response3_2 = AddBidResponse(bidResponses, bid3_2, specialists[1].Id, "Expert in power distribution for manufacturing facilities.", 85000m, 60, bid3_2.CreatedAt.AddDays(1));
        var response3_3 = AddBidResponse(bidResponses, bid3_3, specialists[2].Id, "Specialized in industrial backup power solutions.", 95000m, 45, bid3_3.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid3_4, specialists[8].Id, "Comprehensive safety system design and implementation.", 45000m, 30, bid3_4.CreatedAt.AddDays(1));

        response3_1.AdminMarkupPercentage = 10m;
        response3_1.AdminComment = "Approved - highly qualified specialist";
        response3_2.AdminMarkupPercentage = 12m;
        response3_2.AdminComment = "Approved - good pricing";
        response3_3.AdminMarkupPercentage = 13m;
        response3_3.AdminComment = "Approved - specialized expertise";

        AddProjectSpecialist(projectSpecialists, project3.Id, specialists[0].Id, project3.CreatedAt.AddDays(12), "Lead Electrical Engineer");
        AddProjectSpecialist(projectSpecialists, project3.Id, specialists[1].Id, project3.CreatedAt.AddDays(12), "Power Systems Engineer");
        AddProjectSpecialist(projectSpecialists, project3.Id, specialists[2].Id, project3.CreatedAt.AddDays(15), "Backup Power Specialist");

        AddBidMessage(bidMessages, response3_1, clientIds[2], "Project timeline looks good. Safety certifications in order?", response3_1.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, response3_1, specialists[0].UserId, "All certifications current. OSHA compliant procedures in place.", response3_1.CreatedAt.AddDays(1).AddHours(4));
        AddBidMessage(bidMessages, response3_2, clientIds[2], "Can you coordinate with the main electrical contractor?", response3_2.CreatedAt.AddHours(8));
        AddBidMessage(bidMessages, response3_2, specialists[1].UserId, "Yes, I'll schedule a coordination meeting next week.", response3_2.CreatedAt.AddHours(10));
        AddBidMessage(bidMessages, response3_3, clientIds[2], "Backup power capacity sufficient for full factory operation?", response3_3.CreatedAt.AddDays(1));
        AddBidMessage(bidMessages, response3_3, specialists[2].UserId, "Yes, designed for 100% load capacity with redundancy.", response3_3.CreatedAt.AddDays(1).AddHours(5));

        // Project 4: Completed (6 bids, 5 responses, 2 specialists assigned)
        var bid4_1 = AddBidRequest(bidRequests, project4.Id, specialists[3].Id, "Plumbing System Design", "Complete plumbing renovation engineering", 125000m, project4.CreatedAt.AddDays(2), BidRequestStatus.Accepted);
        var bid4_2 = AddBidRequest(bidRequests, project4.Id, specialists[4].Id, "Water Efficiency Consulting", "Water conservation system design", 18000m, project4.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid4_3 = AddBidRequest(bidRequests, project4.Id, specialists[5].Id, "Fixture Installation Services", "Modern fixture installation and testing", 32000m, project4.CreatedAt.AddDays(3), BidRequestStatus.Responded);
        var bid4_4 = AddBidRequest(bidRequests, project4.Id, specialists[6].Id, "Pipe Replacement Bid", "Alternative piping solution", 135000m, project4.CreatedAt.AddDays(4), BidRequestStatus.Responded);
        var bid4_5 = AddBidRequest(bidRequests, project4.Id, specialists[7].Id, "Plumbing Inspection", "Pre and post installation inspection services", 8000m, project4.CreatedAt.AddDays(5), BidRequestStatus.Responded);
        AddBidRequest(bidRequests, project4.Id, specialists[8].Id, "Water Quality Testing", "Water quality analysis and treatment", 12000m, project4.CreatedAt.AddDays(5));

        var response4_1 = AddBidResponse(bidResponses, bid4_1, specialists[3].Id, "Licensed plumbing engineer with 12 years in multi-unit residential projects.", 125000m, 75, bid4_1.CreatedAt.AddDays(1));
        var response4_2 = AddBidResponse(bidResponses, bid4_2, specialists[4].Id, "LEED certified professional. Water efficiency specialist.", 18000m, 20, bid4_2.CreatedAt.AddDays(1));
        var response4_3 = AddBidResponse(bidResponses, bid4_3, specialists[5].Id, "Experienced with modern low-flow fixtures and smart water systems.", 32000m, 30, bid4_3.CreatedAt.AddDays(1));
        var response4_4 = AddBidResponse(bidResponses, bid4_4, specialists[6].Id, "Alternative PEX piping solution with longer warranty.", 135000m, 80, bid4_4.CreatedAt.AddDays(1));
        var response4_5 = AddBidResponse(bidResponses, bid4_5, specialists[7].Id, "Certified plumbing inspector. Thorough documentation provided.", 8000m, 10, bid4_5.CreatedAt.AddDays(1));

        response4_1.AdminMarkupPercentage = 11m;
        response4_1.AdminComment = "Approved - project completed successfully";
        response4_2.AdminMarkupPercentage = 14m;
        response4_2.AdminComment = "Approved - sustainability focus";

        AddProjectSpecialist(projectSpecialists, project4.Id, specialists[3].Id, project4.CreatedAt.AddDays(8), "Lead Plumbing Engineer");
        AddProjectSpecialist(projectSpecialists, project4.Id, specialists[4].Id, project4.CreatedAt.AddDays(8), "Water Efficiency Consultant");

        AddBidMessage(bidMessages, response4_1, clientIds[0], "Project completed on time. Excellent work!", response4_1.CreatedAt.AddDays(70));
        AddBidMessage(bidMessages, response4_1, specialists[3].UserId, "Thank you! All systems tested and certified.", response4_1.CreatedAt.AddDays(70).AddHours(2));
        AddBidMessage(bidMessages, response4_2, clientIds[0], "Water bill reduced by 30%. Very satisfied.", response4_2.CreatedAt.AddDays(71));
        AddBidMessage(bidMessages, response4_2, specialists[4].UserId, "Great to hear! The new fixtures are performing excellently.", response4_2.CreatedAt.AddDays(71).AddHours(3));
        AddBidMessage(bidMessages, response4_3, clientIds[0], "Fixtures working perfectly. Thank you!", response4_3.CreatedAt.AddDays(72));
        AddBidMessage(bidMessages, response4_3, specialists[5].UserId, "You're welcome! Glad everything is working well.", response4_3.CreatedAt.AddDays(72).AddHours(2));
        AddBidMessage(bidMessages, response4_4, clientIds[0], "PEX piping quality is excellent.", response4_4.CreatedAt.AddDays(73));
        AddBidMessage(bidMessages, response4_4, specialists[6].UserId, "25-year warranty on all piping. Built to last.", response4_4.CreatedAt.AddDays(73).AddHours(4));
        AddBidMessage(bidMessages, response4_5, clientIds[0], "Inspection report very detailed. Appreciated.", response4_5.CreatedAt.AddDays(74));
        AddBidMessage(bidMessages, response4_5, specialists[7].UserId, "Thorough documentation is our standard. Happy to help.", response4_5.CreatedAt.AddDays(74).AddHours(3));

        // Project 5: InProgress (3 bids, 3 responses, 4 specialists assigned - this is incorrect, max 3 specialists)
        var bid5_1 = AddBidRequest(bidRequests, project5.Id, specialists[0].Id, "Fire Sprinkler System", "Complete sprinkler system design and installation", 210000m, project5.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid5_2 = AddBidRequest(bidRequests, project5.Id, specialists[1].Id, "Fire Alarm Systems", "Fire detection and alarm system integration", 85000m, project5.CreatedAt.AddDays(4), BidRequestStatus.Accepted);
        var bid5_3 = AddBidRequest(bidRequests, project5.Id, specialists[2].Id, "Emergency Systems", "Emergency lighting and exit systems", 42000m, project5.CreatedAt.AddDays(5), BidRequestStatus.Accepted);

        var response5_1 = AddBidResponse(bidResponses, bid5_1, specialists[0].Id, "NFPA certified fire protection engineer. 18 years experience.", 210000m, 150, bid5_1.CreatedAt.AddDays(2));
        var response5_2 = AddBidResponse(bidResponses, bid5_2, specialists[1].Id, "Advanced fire alarm systems specialist. Addressable systems expert.", 85000m, 60, bid5_2.CreatedAt.AddDays(1));
        var response5_3 = AddBidResponse(bidResponses, bid5_3, specialists[2].Id, "Emergency systems designer. Code compliant solutions.", 42000m, 45, bid5_3.CreatedAt.AddDays(1));

        response5_1.AdminMarkupPercentage = 10m;
        response5_1.AdminComment = "Approved - fire safety critical";
        response5_2.AdminMarkupPercentage = 12m;
        response5_2.AdminComment = "Approved - modern system design";
        response5_3.AdminMarkupPercentage = 13m;
        response5_3.AdminComment = "Approved";

        AddProjectSpecialist(projectSpecialists, project5.Id, specialists[0].Id, project5.CreatedAt.AddDays(10), "Fire Protection Engineer");
        AddProjectSpecialist(projectSpecialists, project5.Id, specialists[1].Id, project5.CreatedAt.AddDays(10), "Fire Alarm Specialist");
        AddProjectSpecialist(projectSpecialists, project5.Id, specialists[2].Id, project5.CreatedAt.AddDays(12), "Emergency Systems Engineer");

        AddBidMessage(bidMessages, response5_1, clientIds[1], "Fire marshal inspection scheduled for next month.", response5_1.CreatedAt.AddDays(5));
        AddBidMessage(bidMessages, response5_1, specialists[0].UserId, "Perfect timing. System will be fully commissioned by then.", response5_1.CreatedAt.AddDays(5).AddHours(3));
        AddBidMessage(bidMessages, response5_2, clientIds[1], "Alarm panel location approved by building management?", response5_2.CreatedAt.AddDays(3));
        AddBidMessage(bidMessages, response5_2, specialists[1].UserId, "Yes, main panel in security office as discussed.", response5_2.CreatedAt.AddDays(3).AddHours(5));
        AddBidMessage(bidMessages, response5_3, clientIds[1], "Emergency lighting test completed successfully.", response5_3.CreatedAt.AddDays(20));

        // Project 6: QuotePending (2 bids, no responses)
        AddBidRequest(bidRequests, project6.Id, specialists[3].Id, "Structural Assessment", "Comprehensive structural integrity evaluation", 45000m, project6.CreatedAt.AddDays(2));
        AddBidRequest(bidRequests, project6.Id, specialists[4].Id, "Reinforcement Engineering", "Structural reinforcement design services", 38000m, project6.CreatedAt.AddDays(3));

        // Project 7: Cancelled (4 bids, 2 responses, 1 specialist was assigned)
        var bid7_1 = AddBidRequest(bidRequests, project7.Id, specialists[5].Id, "Architectural Renovation", "Complete renovation architectural services", 95000m, project7.CreatedAt.AddDays(4), BidRequestStatus.Rejected);
        var bid7_2 = AddBidRequest(bidRequests, project7.Id, specialists[6].Id, "Structural Modifications", "Structural engineering for renovations", 65000m, project7.CreatedAt.AddDays(5), BidRequestStatus.Withdrawn);
        AddBidRequest(bidRequests, project7.Id, specialists[7].Id, "MEP Systems Upgrade", "Mechanical electrical plumbing upgrade", 85000m, project7.CreatedAt.AddDays(6));
        AddBidRequest(bidRequests, project7.Id, specialists[8].Id, "Interior Design Services", "Modern interior finishing consultation", 42000m, project7.CreatedAt.AddDays(6));

        var response7_1 = AddBidResponse(bidResponses, bid7_1, specialists[5].Id, "Modern design approach with historical preservation elements.", 95000m, 90, bid7_1.CreatedAt.AddDays(2));
        response7_1.RejectionReason = "Project cancelled due to budget constraints";

        AddBidResponse(bidResponses, bid7_2, specialists[6].Id, "Structural engineering for safe renovations.", 65000m, 60, bid7_2.CreatedAt.AddDays(1));

        AddProjectSpecialist(projectSpecialists, project7.Id, specialists[5].Id, project7.CreatedAt.AddDays(12), "Renovation Architect");

        AddBidMessage(bidMessages, response7_1, clientIds[0], "Budget exceeded. Need to pause project.", response7_1.CreatedAt.AddDays(20));
        AddBidMessage(bidMessages, response7_1, specialists[5].UserId, "Understood. Let me know if you want to revisit with reduced scope.", response7_1.CreatedAt.AddDays(20).AddHours(4));
        AddBidMessage(bidMessages, response7_1, clientIds[0], "Will contact you next quarter after refinancing.", response7_1.CreatedAt.AddDays(21));
        AddBidMessage(bidMessages, response7_1, specialists[5].UserId, "Sounds good. I'll keep the designs on file.", response7_1.CreatedAt.AddDays(21).AddHours(2));

        // Project 8: InProgress (5 bids, 4 responses, 3 specialists assigned)
        var bid8_1 = AddBidRequest(bidRequests, project8.Id, specialists[0].Id, "Medical HVAC Systems", "Hospital-grade HVAC with isolation capabilities", 425000m, project8.CreatedAt.AddDays(5), BidRequestStatus.Accepted);
        var bid8_2 = AddBidRequest(bidRequests, project8.Id, specialists[1].Id, "Medical Electrical", "Medical facility electrical infrastructure", 185000m, project8.CreatedAt.AddDays(6), BidRequestStatus.Accepted);
        var bid8_3 = AddBidRequest(bidRequests, project8.Id, specialists[2].Id, "Building Automation", "Advanced BMS for medical facility", 95000m, project8.CreatedAt.AddDays(7), BidRequestStatus.Accepted);
        var bid8_4 = AddBidRequest(bidRequests, project8.Id, specialists[3].Id, "Air Filtration Systems", "HEPA filtration for isolation rooms", 125000m, project8.CreatedAt.AddDays(8), BidRequestStatus.Responded);
        AddBidRequest(bidRequests, project8.Id, specialists[4].Id, "Emergency Power Backup", "Hospital emergency power systems", 215000m, project8.CreatedAt.AddDays(9));

        var response8_1 = AddBidResponse(bidResponses, bid8_1, specialists[0].Id, "Medical facility HVAC specialist. Isolation room expert with 20+ years.", 425000m, 200, bid8_1.CreatedAt.AddDays(2));
        var response8_2 = AddBidResponse(bidResponses, bid8_2, specialists[1].Id, "Hospital electrical systems engineer. Critical power specialist.", 185000m, 180, bid8_2.CreatedAt.AddDays(2));
        var response8_3 = AddBidResponse(bidResponses, bid8_3, specialists[2].Id, "Medical BMS expert. Patient comfort and safety priority.", 95000m, 90, bid8_3.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid8_4, specialists[3].Id, "HEPA filtration specialist. Negative pressure room experience.", 125000m, 60, bid8_4.CreatedAt.AddDays(1));

        response8_1.AdminMarkupPercentage = 8m;
        response8_1.AdminComment = "Approved - critical medical infrastructure";
        response8_2.AdminMarkupPercentage = 9m;
        response8_2.AdminComment = "Approved - hospital electrical expert";
        response8_3.AdminMarkupPercentage = 11m;
        response8_3.AdminComment = "Approved - BMS integration essential";

        AddProjectSpecialist(projectSpecialists, project8.Id, specialists[0].Id, project8.CreatedAt.AddDays(15), "Lead Medical HVAC Engineer");
        AddProjectSpecialist(projectSpecialists, project8.Id, specialists[1].Id, project8.CreatedAt.AddDays(15), "Hospital Electrical Engineer");
        AddProjectSpecialist(projectSpecialists, project8.Id, specialists[2].Id, project8.CreatedAt.AddDays(18), "Building Automation Specialist");

        AddBidMessage(bidMessages, response8_1, clientIds[1], "Isolation rooms meet CDC guidelines?", response8_1.CreatedAt.AddDays(3));
        AddBidMessage(bidMessages, response8_1, specialists[0].UserId, "Yes, full compliance with CDC and state health department standards.", response8_1.CreatedAt.AddDays(3).AddHours(2));
        AddBidMessage(bidMessages, response8_2, clientIds[1], "Emergency power transfer time acceptable?", response8_2.CreatedAt.AddDays(4));
        AddBidMessage(bidMessages, response8_2, specialists[1].UserId, "Less than 10 seconds. Critical circuits have UPS backup.", response8_2.CreatedAt.AddDays(4).AddHours(3));
        AddBidMessage(bidMessages, response8_3, clientIds[1], "BMS integration with existing hospital systems?", response8_3.CreatedAt.AddDays(5));
        AddBidMessage(bidMessages, response8_3, specialists[2].UserId, "Full integration planned. Compatible with your current system.", response8_3.CreatedAt.AddDays(5).AddHours(4));
        AddBidMessage(bidMessages, response8_3, clientIds[1], "Perfect. Keep IT team in the loop.", response8_3.CreatedAt.AddDays(6));

        // Project 9: Completed (3 bids, 3 responses, 2 specialists assigned)
        var bid9_1 = AddBidRequest(bidRequests, project9.Id, specialists[5].Id, "Electrical Safety Audit", "Comprehensive electrical safety inspection", 65000m, project9.CreatedAt.AddDays(3), BidRequestStatus.Accepted);
        var bid9_2 = AddBidRequest(bidRequests, project9.Id, specialists[6].Id, "Environmental Compliance", "Environmental impact and compliance assessment", 48000m, project9.CreatedAt.AddDays(4), BidRequestStatus.Accepted);
        var bid9_3 = AddBidRequest(bidRequests, project9.Id, specialists[7].Id, "Structural Integrity", "Plant structural safety evaluation", 38000m, project9.CreatedAt.AddDays(5), BidRequestStatus.Responded);

        var response9_1 = AddBidResponse(bidResponses, bid9_1, specialists[5].Id, "Licensed electrical inspector. Power plant experience.", 65000m, 45, bid9_1.CreatedAt.AddDays(1));
        var response9_2 = AddBidResponse(bidResponses, bid9_2, specialists[6].Id, "Environmental engineer. EPA compliance specialist.", 48000m, 40, bid9_2.CreatedAt.AddDays(1));
        AddBidResponse(bidResponses, bid9_3, specialists[7].Id, "Structural inspector with industrial facility experience.", 38000m, 30, bid9_3.CreatedAt.AddDays(1));

        response9_1.AdminMarkupPercentage = 10m;
        response9_1.AdminComment = "Approved - inspection completed successfully";
        response9_2.AdminMarkupPercentage = 12m;
        response9_2.AdminComment = "Approved - all compliance met";

        AddProjectSpecialist(projectSpecialists, project9.Id, specialists[5].Id, project9.CreatedAt.AddDays(10), "Electrical Safety Inspector");
        AddProjectSpecialist(projectSpecialists, project9.Id, specialists[6].Id, project9.CreatedAt.AddDays(10), "Environmental Compliance Engineer");

        AddBidMessage(bidMessages, response9_1, clientIds[2], "All electrical systems passed inspection. Great work!", response9_1.CreatedAt.AddDays(40));
        AddBidMessage(bidMessages, response9_1, specialists[5].UserId, "Thank you! Comprehensive report submitted to regulatory authorities.", response9_1.CreatedAt.AddDays(40).AddHours(3));
        AddBidMessage(bidMessages, response9_2, clientIds[2], "Environmental certification received. Excellent job.", response9_2.CreatedAt.AddDays(38));
        AddBidMessage(bidMessages, response9_2, specialists[6].UserId, "Glad to help. Plant is fully compliant for next 5 years.", response9_2.CreatedAt.AddDays(38).AddHours(4));
        AddBidMessage(bidMessages, response9_2, clientIds[2], "Will recommend your services to other facilities.", response9_2.CreatedAt.AddDays(39));
        AddBidMessage(bidMessages, response9_2, specialists[6].UserId, "Much appreciated! Always happy to help with compliance needs.", response9_2.CreatedAt.AddDays(39).AddHours(2));

        // Project 10: Draft (no bids)

        await context.BidRequests.AddRangeAsync(bidRequests);
        await context.SaveChangesAsync();

        await context.BidResponses.AddRangeAsync(bidResponses);
        await context.SaveChangesAsync();

        await context.ProjectSpecialists.AddRangeAsync(projectSpecialists);
        await context.SaveChangesAsync();

        await context.BidMessages.AddRangeAsync(bidMessages);
        await context.SaveChangesAsync();
    }

    private static Project CreateProject(
        string name,
        string description,
        string clientId,
        string streetAddress,
        string city,
        string state,
        string zipCode,
        ProjectScope scope,
        ProjectStatus status,
        DateTime createdAt)
    {
        return new Project
        {
            Name = name,
            Description = description,
            Status = status,
            ClientId = clientId,
            StreetAddress = streetAddress,
            City = city,
            State = state,
            ZipCode = zipCode,
            ProjectScope = scope,
            ManagementType = ProjectManagementType.DigitalEngineersManaged,
            Budget = 0,
            StartDate = status == ProjectStatus.InProgress || status == ProjectStatus.Completed 
                ? createdAt.AddDays(15) 
                : null,
            CreatedAt = createdAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static void AddProjectLicenseTypes(
        List<ProjectLicenseType> list,
        int projectId,
        List<LicenseType> allLicenseTypes,
        string[] licenseNames)
    {
        foreach (var name in licenseNames)
        {
            var licenseType = allLicenseTypes.FirstOrDefault(lt => lt.Name == name);
            if (licenseType != null)
            {
                list.Add(new ProjectLicenseType
                {
                    ProjectId = projectId,
                    LicenseTypeId = licenseType.Id
                });
            }
        }
    }

    private static void AddProjectFile(
        List<ProjectFile> list,
        int projectId,
        string uploadedBy,
        string fileName,
        long fileSize,
        string contentType)
    {
        list.Add(new ProjectFile
        {
            ProjectId = projectId,
            FileName = fileName,
            FileUrl = $"projects/{projectId}/{fileName}",
            FileSize = fileSize,
            ContentType = contentType,
            UploadedBy = uploadedBy,
            UploadedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30))
        });
    }

    private static BidRequest AddBidRequest(
        List<BidRequest> list,
        int projectId,
        int specialistId,
        string title,
        string description,
        decimal proposedBudget,
        DateTime createdAt,
        BidRequestStatus status = BidRequestStatus.Pending)
    {
        var bidRequest = new BidRequest
        {
            ProjectId = projectId,
            SpecialistId = specialistId,
            Title = title,
            Description = description,
            Status = status,
            ProposedBudget = proposedBudget,
            Deadline = createdAt.AddDays(30),
            CreatedAt = createdAt,
            UpdatedAt = DateTime.UtcNow
        };
        list.Add(bidRequest);
        return bidRequest;
    }

    private static BidResponse AddBidResponse(
        List<BidResponse> list,
        BidRequest bidRequest,
        int specialistId,
        String coverLetter,
        decimal proposedPrice,
        int estimatedDays,
        DateTime createdAt)
    {
        var response = new BidResponse
        {
            BidRequest = bidRequest,
            SpecialistId = specialistId,
            CoverLetter = coverLetter,
            ProposedPrice = proposedPrice,
            EstimatedDays = estimatedDays,
            CreatedAt = createdAt,
            UpdatedAt = DateTime.UtcNow
        };
        list.Add(response);
        return response;
    }

    private static void AddProjectSpecialist(
        List<ProjectSpecialist> list,
        int projectId,
        int specialistId,
        DateTime assignedAt,
        string? role = null)
    {
        list.Add(new ProjectSpecialist
        {
            ProjectId = projectId,
            SpecialistId = specialistId,
            AssignedAt = assignedAt,
            Role = role
        });
    }

    private static void AddBidMessage(
        List<BidMessage> list,
        BidResponse bidResponse,
        string senderId,
        string messageText,
        DateTime createdAt)
    {
        list.Add(new BidMessage
        {
            BidResponse = bidResponse,  // ✅ Navigation property instead of Id
            SenderId = senderId,
            MessageText = messageText,
            CreatedAt = createdAt
        });
    }
}
