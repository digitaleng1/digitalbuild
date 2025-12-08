using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class LookupSeeder
{
    public static async Task<SeededLookups> SeedAsync(
        ApplicationDbContext context,
        List<ProfessionConfig> professionConfigs,
        List<LicenseTypeConfig> licenseTypeConfigs,
        ILogger logger)
    {
        var professions = new List<Profession>();
        var licenseTypes = new List<LicenseType>();

        // Seed professions from config
        foreach (var config in professionConfigs)
        {
            var existing = await context.Professions
                .FirstOrDefaultAsync(p => p.Name == config.Name);

            if (existing == null)
            {
                var profession = new Profession
                {
                    Name = config.Name,
                    Description = config.Description,
                    IsApproved = true,
                    CreatedAt = DateTime.UtcNow
                };
                context.Professions.Add(profession);
                professions.Add(profession);
            }
            else
            {
                professions.Add(existing);
            }
        }

        await context.SaveChangesAsync();

        // Seed license types from config
        foreach (var config in licenseTypeConfigs)
        {
            var profession = professions.FirstOrDefault(p => p.Name == config.ProfessionName);
            if (profession == null)
            {
                logger.LogWarning("Profession {ProfessionName} not found for license type {LicenseTypeName}",
                    config.ProfessionName, config.Name);
                continue;
            }

            var existing = await context.LicenseTypes
                .FirstOrDefaultAsync(lt => lt.Name == config.Name && lt.ProfessionId == profession.Id);

            if (existing == null)
            {
                var licenseType = new LicenseType
                {
                    Name = config.Name,
                    Description = config.Description,
                    ProfessionId = profession.Id,
                    IsApproved = true,
                    CreatedAt = DateTime.UtcNow
                };
                context.LicenseTypes.Add(licenseType);
                licenseTypes.Add(licenseType);
            }
            else
            {
                licenseTypes.Add(existing);
            }
        }

        await context.SaveChangesAsync();

        return new SeededLookups(professions, licenseTypes);
    }
}
