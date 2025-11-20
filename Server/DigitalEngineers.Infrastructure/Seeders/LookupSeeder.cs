using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProjectTaskStatusEntity = DigitalEngineers.Infrastructure.Entities.ProjectTaskStatus;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class LookupSeeder
{
    public static async Task<SeededLookups> SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var professions = await SeedProfessionsAsync(context, logger);
        var licenseTypes = await SeedLicenseTypesAsync(context, logger, professions);

        return new SeededLookups(professions, licenseTypes);
    }

    private static async Task<List<Profession>> SeedProfessionsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Professions.AnyAsync())
        {
            return await context.Professions.ToListAsync();
        }

        var professions = new List<Profession>
        {
            new() { Name = "Engineering", Description = "Professional Engineer" },
            new() { Name = "Transportation Trades", Description = "Transportation" }
        };

        await context.Professions.AddRangeAsync(professions);
        await context.SaveChangesAsync();

        return professions;
    }

    private static async Task<List<LicenseType>> SeedLicenseTypesAsync(ApplicationDbContext context, ILogger logger, List<Profession> professions)
    {
        if (await context.LicenseTypes.AnyAsync())
        {
            return await context.LicenseTypes.ToListAsync();
        }

        var engineeringProfession = professions.FirstOrDefault(p => p.Name == "Engineering");
        var transportationProfession = professions.FirstOrDefault(p => p.Name == "Transportation Trades");

        if (engineeringProfession == null || transportationProfession == null)
        {
            logger.LogError("Cannot seed license types - professions not found");
            return new List<LicenseType>();
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

        return licenseTypes;
    }

}
