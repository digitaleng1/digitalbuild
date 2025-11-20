using DigitalEngineers.Infrastructure.Entities.Identity;
using DigitalEngineers.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class UserSeeder
{
    public static async Task<SeededUsers> SeedAsync(UserManager<ApplicationUser> userManager)
    {
        var admins = await SeedAdminsAsync(userManager);
        var providers = await SeedProvidersAsync(userManager);
        var clients = await SeedClientsAsync(userManager);

        return new SeededUsers(admins, providers, clients);
    }

    private static async Task<List<ApplicationUser>> SeedAdminsAsync(UserManager<ApplicationUser> userManager)
    {
        var admins = new List<ApplicationUser>();

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
                CreatedAt = DateTime.UtcNow.AddYears(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                LastActive = DateTime.UtcNow,
                IsActive = true
            };

            var result = await userManager.CreateAsync(superAdmin, "SuperAdmin123!@#");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(superAdmin, UserRoles.SuperAdmin);
                admins.Add(superAdmin);
            }
        }
        else
        {
            admins.Add(existingSuperAdmin);
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
                CreatedAt = DateTime.UtcNow.AddYears(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                LastActive = DateTime.UtcNow,
                IsActive = true
            };

            var result = await userManager.CreateAsync(admin, "Admin123!@#");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, UserRoles.Admin);
                admins.Add(admin);
            }
        }
        else
        {
            admins.Add(existingAdmin);
        }

        return admins;
    }

    private static async Task<List<ApplicationUser>> SeedProvidersAsync(UserManager<ApplicationUser> userManager)
    {
        var providersData = GetProvidersSeedData();
        var createdProviders = new List<ApplicationUser>();

        foreach (var provider in providersData)
        {
            var existing = await userManager.FindByEmailAsync(provider.Email!);
            if (existing == null)
            {
                var result = await userManager.CreateAsync(provider, "Password123!@#");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(provider, UserRoles.Provider);
                    createdProviders.Add(provider);
                }
            }
            else
            {
                createdProviders.Add(existing);
            }
        }

        return createdProviders;
    }

    private static async Task<List<ApplicationUser>> SeedClientsAsync(UserManager<ApplicationUser> userManager)
    {
        var clientsData = GetClientsSeedData();
        var createdClients = new List<ApplicationUser>();

        foreach (var client in clientsData)
        {
            var existing = await userManager.FindByEmailAsync(client.Email!);
            if (existing == null)
            {
                var result = await userManager.CreateAsync(client, "Password123!@#");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(client, UserRoles.Client);
                    createdClients.Add(client);
                }
            }
            else
            {
                createdClients.Add(existing);
            }
        }

        return createdClients;
    }

    private static List<ApplicationUser> GetProvidersSeedData()
    {
        return new List<ApplicationUser>
        {
            new()
            {
                Id = "11111111-1111-1111-1111-111111111111",
                UserName = "john.smith@example.com",
                Email = "john.smith@example.com",
                EmailConfirmed = true,
                FirstName = "John",
                LastName = "Smith",
                PhoneNumber = "555-123-4567",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/men/1.jpg",
                Biography = "Experienced civil engineer with over 10 years in infrastructure projects. Specialized in bridge design and construction management.",
                Location = "New York, NY",
                Website = "https://johnsmith-engineering.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-12),
                UpdatedAt = DateTime.UtcNow.AddDays(-5),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "22222222-2222-2222-2222-222222222222",
                UserName = "sarah.johnson@example.com",
                Email = "sarah.johnson@example.com",
                EmailConfirmed = true,
                FirstName = "Sarah",
                LastName = "Johnson",
                PhoneNumber = "555-234-5678",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/women/2.jpg",
                Biography = "Architectural engineer specializing in sustainable building design. LEED certified with expertise in energy-efficient structures.",
                Location = "San Francisco, CA",
                Website = "https://sarahjohnson-architecture.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-2),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "33333333-3333-3333-3333-333333333333",
                UserName = "michael.chen@example.com",
                Email = "michael.chen@example.com",
                EmailConfirmed = true,
                FirstName = "Michael",
                LastName = "Chen",
                PhoneNumber = "555-345-6789",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/men/3.jpg",
                Biography = "Software engineer with focus on IoT solutions for smart infrastructure. Experience with embedded systems and cloud integration.",
                Location = "Seattle, WA",
                Website = "https://michaelchen-tech.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-14),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "44444444-4444-4444-4444-444444444444",
                UserName = "emily.williams@example.com",
                Email = "emily.williams@example.com",
                EmailConfirmed = true,
                FirstName = "Emily",
                LastName = "Williams",
                PhoneNumber = "555-456-7890",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/women/4.jpg",
                Biography = "Environmental engineer focused on water management and sustainability. Experienced in developing solutions for water conservation and treatment.",
                Location = "Portland, OR",
                Website = "https://emilywilliams-environmental.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-6),
                UpdatedAt = DateTime.UtcNow.AddDays(-8),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "55555555-5555-5555-5555-555555555555",
                UserName = "david.rodriguez@example.com",
                Email = "david.rodriguez@example.com",
                EmailConfirmed = true,
                FirstName = "David",
                LastName = "Rodriguez",
                PhoneNumber = "555-567-8901",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/men/5.jpg",
                Biography = "Mechanical engineer specializing in renewable energy systems. Extensive experience in designing solar and wind power installations.",
                Location = "Austin, TX",
                Website = "https://davidrodriguez-energy.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-9),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "66666666-6666-6666-6666-666666666666",
                UserName = "olivia.taylor@example.com",
                Email = "olivia.taylor@example.com",
                EmailConfirmed = true,
                FirstName = "Olivia",
                LastName = "Taylor",
                PhoneNumber = "555-678-9012",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/women/6.jpg",
                Biography = "Electrical engineer with expertise in power systems and smart grid technologies. Focus on renewable energy integration.",
                Location = "Boston, MA",
                Website = "https://oliviataylor-electrical.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-11),
                UpdatedAt = DateTime.UtcNow.AddDays(-22),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "77777777-7777-7777-7777-777777777777",
                UserName = "james.brown@example.com",
                Email = "james.brown@example.com",
                EmailConfirmed = true,
                FirstName = "James",
                LastName = "Brown",
                PhoneNumber = "555-789-0123",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/men/7.jpg",
                Biography = "Civil engineer specializing in urban planning and transportation infrastructure. Experience working with city governments on public transit projects.",
                Location = "Chicago, IL",
                Website = "https://jamesbrown-civil.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-4),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "88888888-8888-8888-8888-888888888888",
                UserName = "sophia.garcia@example.com",
                Email = "sophia.garcia@example.com",
                EmailConfirmed = true,
                FirstName = "Sophia",
                LastName = "Garcia",
                PhoneNumber = "555-890-1234",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/women/8.jpg",
                Biography = "Structural engineer with focus on earthquake-resistant design. Experience working on high-rise buildings and public infrastructure in seismic zones.",
                Location = "Los Angeles, CA",
                Website = "https://sophiagarcia-structural.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-3),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            },
            new()
            {
                Id = "99999999-9999-9999-9999-999999999999",
                UserName = "william.miller@example.com",
                Email = "william.miller@example.com",
                EmailConfirmed = true,
                FirstName = "William",
                LastName = "Miller",
                PhoneNumber = "555-901-2345",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/men/9.jpg",
                Biography = "Construction engineer with extensive experience in project management and site supervision. Specialized in commercial buildings and industrial facilities.",
                Location = "Denver, CO",
                Website = "https://williammiller-construction.example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-4),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24)),
                IsActive = true
            }
        };
    }

    private static List<ApplicationUser> GetClientsSeedData()
    {
        return new List<ApplicationUser>
        {
            new()
            {
                Id = "c1111111-1111-1111-1111-111111111111",
                UserName = "robert.anderson@example.com",
                Email = "robert.anderson@example.com",
                EmailConfirmed = true,
                FirstName = "Robert",
                LastName = "Anderson",
                PhoneNumber = "555-111-2222",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/men/10.jpg",
                Biography = "CEO of Anderson Construction looking for engineering partners for upcoming projects.",
                Location = "New York, NY",
                CreatedAt = DateTime.UtcNow.AddMonths(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 10)),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48)),
                IsActive = true
            },
            new()
            {
                Id = "c2222222-2222-2222-2222-222222222222",
                UserName = "jessica.martinez@example.com",
                Email = "jessica.martinez@example.com",
                EmailConfirmed = true,
                FirstName = "Jessica",
                LastName = "Martinez",
                PhoneNumber = "555-222-3333",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/women/10.jpg",
                Biography = "Project manager seeking engineering consultants for residential development.",
                Location = "Los Angeles, CA",
                CreatedAt = DateTime.UtcNow.AddMonths(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 10)),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48)),
                IsActive = true
            },
            new()
            {
                Id = "c3333333-3333-3333-3333-333333333333",
                UserName = "daniel.thompson@example.com",
                Email = "daniel.thompson@example.com",
                EmailConfirmed = true,
                FirstName = "Daniel",
                LastName = "Thompson",
                PhoneNumber = "555-333-4444",
                ProfilePictureUrl = "https://randomuser.me/api/portraits/men/11.jpg",
                Biography = "Real estate developer looking for structural engineers for commercial projects.",
                Location = "Chicago, IL",
                CreatedAt = DateTime.UtcNow.AddMonths(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 10)),
                LastActive = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48)),
                IsActive = true
            }
        };
    }
}
