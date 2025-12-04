using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class ClientSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        List<ApplicationUser> clientUsers,
        ILogger logger)
    {
        if (await context.Clients.AnyAsync())
        {
            logger.LogWarning("Clients already seeded");
            return;
        }

        var clients = new List<Client>();

        foreach (var user in clientUsers)
        {
            var client = new Client
            {
                UserId = user.Id,
                CompanyName = GenerateCompanyName(user.FirstName, user.LastName),
                Industry = GetRandomIndustry(),
                Website = $"https://{user.FirstName?.ToLower()}-{user.LastName?.ToLower()}.example.com",
                CompanyDescription = $"Professional services company managed by {user.FirstName} {user.LastName}",
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
            
            clients.Add(client);
        }

        await context.Clients.AddRangeAsync(clients);
        await context.SaveChangesAsync();
        
        logger.LogWarning("Seeded {Count} clients", clients.Count);
    }

    private static string GenerateCompanyName(string? firstName, string? lastName)
    {
        var suffix = new[] { "Construction", "Builders", "Development", "Group", "Enterprises" };
        return $"{lastName} {suffix[Random.Shared.Next(suffix.Length)]}";
    }

    private static string GetRandomIndustry()
    {
        var industries = new[] { "Construction", "Real Estate", "Manufacturing", "Engineering", "Architecture" };
        return industries[Random.Shared.Next(industries.Length)];
    }
}
