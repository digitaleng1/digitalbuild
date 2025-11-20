using DigitalEngineers.Infrastructure.Entities;
namespace DigitalEngineers.Infrastructure.Seeders;

public class SeededLookups
{
    public List<Profession> Professions { get; }
    public List<LicenseType> LicenseTypes { get; }

    public SeededLookups(List<Profession> professions, List<LicenseType> licenseTypes)
    {
        Professions = professions;
        LicenseTypes = licenseTypes;
    }
}
