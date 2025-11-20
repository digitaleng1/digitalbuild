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
        ILogger logger)
    {
        if (await context.Specialists.AnyAsync())
        {
            return await context.Specialists.Include(s => s.LicenseTypes).ToListAsync();
        }

        if (licenseTypes.Count == 0)
        {
            logger.LogError("No license types found. Cannot seed specialists.");
            return new List<Specialist>();
        }

        var specialists = new List<Specialist>();
        var specialistLicenseTypes = new List<SpecialistLicenseType>();
        var allLicenseTypeIds = licenseTypes.Select(lt => lt.Id).ToList();

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

        foreach (var specialist in specialists)
        {
            var licenseCount = Random.Shared.Next(5, 11);
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

        await context.SpecialistLicenseTypes.AddRangeAsync(specialistLicenseTypes);
        await context.SaveChangesAsync();

        return await context.Specialists.Include(s => s.LicenseTypes).ToListAsync();
    }
}
