using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DigitalEngineers.Infrastructure.Seeders;

/// <summary>
/// Seeds CSI Trade Categories data: Professions, ProfessionTypes, LicenseTypes, and ProfessionTypeLicenseRequirements
/// </summary>
public static class CsiTradeSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, CsiTradeSettings settings, ILogger logger)
    {
        // Check if data already exists
        if (await context.ProfessionTypes.AnyAsync())
        {
            return;
        }

        // 1. Seed Professions (Categories)
        var professions = await SeedProfessionsAsync(context, settings.Professions);
        
        // 2. Seed LicenseTypes
        var licenseTypes = await SeedLicenseTypesAsync(context, settings.LicenseTypes);
        
        // 3. Seed ProfessionTypes
        var professionTypes = await SeedProfessionTypesAsync(context, professions, settings.ProfessionTypes);
        
        // 4. Seed LicenseRequirements
        await SeedLicenseRequirementsAsync(context, professionTypes, licenseTypes, settings.LicenseRequirements);
        
        await context.SaveChangesAsync();
    }

    private static async Task<Dictionary<string, Profession>> SeedProfessionsAsync(
        ApplicationDbContext context,
        List<CsiProfessionConfig> professionConfigs)
    {
        var result = new Dictionary<string, Profession>();
        
        foreach (var config in professionConfigs)
        {
            var existing = await context.Professions.FirstOrDefaultAsync(p => p.Code == config.Code);
            if (existing != null)
            {
                existing.Name = config.Name;
                existing.Description = config.Description;
                existing.DisplayOrder = config.DisplayOrder;
                existing.UpdatedAt = DateTime.UtcNow;
                result[config.Code] = existing;
            }
            else
            {
                var profession = new Profession
                {
                    Code = config.Code,
                    Name = config.Name,
                    Description = config.Description,
                    DisplayOrder = config.DisplayOrder,
                    IsApproved = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.Professions.Add(profession);
                result[config.Code] = profession;
            }
        }

        await context.SaveChangesAsync();
        return result;
    }

    private static async Task<Dictionary<string, LicenseType>> SeedLicenseTypesAsync(
        ApplicationDbContext context,
        List<CsiLicenseTypeConfig> licenseConfigs)
    {
        var result = new Dictionary<string, LicenseType>();
        
        foreach (var config in licenseConfigs)
        {
            var existing = await context.LicenseTypes.FirstOrDefaultAsync(lt => lt.Code == config.Code);
            if (existing != null)
            {
                existing.Name = config.Name;
                existing.Description = config.Description;
                existing.IsStateSpecific = config.IsStateSpecific;
                existing.UpdatedAt = DateTime.UtcNow;
                result[config.Code] = existing;
            }
            else
            {
                var licenseType = new LicenseType
                {
                    Code = config.Code,
                    Name = config.Name,
                    Description = config.Description,
                    IsStateSpecific = config.IsStateSpecific,
                    IsApproved = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.LicenseTypes.Add(licenseType);
                result[config.Code] = licenseType;
            }
        }

        await context.SaveChangesAsync();
        return result;
    }

    private static async Task<Dictionary<string, ProfessionType>> SeedProfessionTypesAsync(
        ApplicationDbContext context, 
        Dictionary<string, Profession> professions,
        List<CsiProfessionTypeConfig> professionTypeConfigs)
    {
        var result = new Dictionary<string, ProfessionType>();
        
        foreach (var config in professionTypeConfigs)
        {
            if (!professions.TryGetValue(config.ProfessionCode, out var profession))
                continue;

            var existing = await context.ProfessionTypes
                .FirstOrDefaultAsync(pt => pt.ProfessionId == profession.Id && pt.Code == config.Code);
            
            if (existing != null)
            {
                existing.Name = config.Name;
                existing.Description = config.Description;
                existing.RequiresStateLicense = config.RequiresStateLicense;
                existing.DisplayOrder = config.DisplayOrder;
                existing.UpdatedAt = DateTime.UtcNow;
                result[config.Code] = existing;
            }
            else
            {
                var professionType = new ProfessionType
                {
                    Code = config.Code,
                    Name = config.Name,
                    Description = config.Description,
                    ProfessionId = profession.Id,
                    RequiresStateLicense = config.RequiresStateLicense,
                    DisplayOrder = config.DisplayOrder,
                    IsActive = true,
                    IsApproved = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.ProfessionTypes.Add(professionType);
                result[config.Code] = professionType;
            }
        }

        await context.SaveChangesAsync();
        return result;
    }

    private static async Task SeedLicenseRequirementsAsync(
        ApplicationDbContext context,
        Dictionary<string, ProfessionType> professionTypes,
        Dictionary<string, LicenseType> licenseTypes,
        List<CsiLicenseRequirementConfig> requirementConfigs)
    {
        foreach (var config in requirementConfigs)
        {
            if (!professionTypes.TryGetValue(config.ProfessionTypeCode, out var professionType))
                continue;
            if (!licenseTypes.TryGetValue(config.LicenseTypeCode, out var licenseType))
                continue;

            var existing = await context.ProfessionTypeLicenseRequirements
                .FirstOrDefaultAsync(lr => lr.ProfessionTypeId == professionType.Id && 
                                          lr.LicenseTypeId == licenseType.Id);
            
            if (existing != null)
            {
                existing.IsRequired = config.IsRequired;
            }
            else
            {
                var requirement = new ProfessionTypeLicenseRequirement
                {
                    ProfessionTypeId = professionType.Id,
                    LicenseTypeId = licenseType.Id,
                    IsRequired = config.IsRequired
                };
                context.ProfessionTypeLicenseRequirements.Add(requirement);
            }
        }

        await context.SaveChangesAsync();
    }
}
