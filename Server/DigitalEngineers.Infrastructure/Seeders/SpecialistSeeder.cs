using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using DigitalEngineers.Infrastructure.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

public static class SpecialistSeeder
{
    public static async Task<List<Specialist>> SeedAsync(
        ApplicationDbContext context,
        List<ApplicationUser> providers,
        List<LicenseType> licenseTypes,
        List<ProviderConfig> providerConfigs,
        ILogger logger)
    {
        if (await context.Specialists.AnyAsync())
        {
            return await context.Specialists.Include(s => s.LicenseTypes).ToListAsync();
        }

        if (licenseTypes.Count == 0)
        {
            logger.LogError("No license types found. Cannot seed specialists");
            return new List<Specialist>();
        }

        var specialists = new List<Specialist>();
        var specialistLicenseTypes = new List<SpecialistLicenseType>();

        foreach (var provider in providers)
        {
            var specialist = new Specialist
            {
                UserId = provider.Id,
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

        // Assign license types from config
        foreach (var specialist in specialists)
        {
            var provider = providers.First(p => p.Id == specialist.UserId);
            var config = providerConfigs.FirstOrDefault(pc => pc.Email == provider.Email);

            if (config != null && config.LicenseTypeNames.Count > 0)
            {
                // Use config license types
                foreach (var licenseTypeName in config.LicenseTypeNames)
                {
                    var licenseType = licenseTypes.FirstOrDefault(lt => lt.Name == licenseTypeName);
                    if (licenseType != null)
                    {
                        specialistLicenseTypes.Add(new SpecialistLicenseType
                        {
                            SpecialistId = specialist.Id,
                            LicenseTypeId = licenseType.Id
                        });
                    }
                }
            }
            else
            {
                // Fallback: random license types
                var licenseCount = Random.Shared.Next(5, 11);
                var allLicenseTypeIds = licenseTypes.Select(lt => lt.Id).ToList();
                var selectedLicenseIds = allLicenseTypeIds
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
        }

        await context.SpecialistLicenseTypes.AddRangeAsync(specialistLicenseTypes);
        await context.SaveChangesAsync();

        return await context.Specialists.Include(s => s.LicenseTypes).ToListAsync();
    }
}
