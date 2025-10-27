namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Many-to-Many relationship between Specialist and LicenseType
/// </summary>
public class SpecialistLicenseType
{
    public int SpecialistId { get; set; }
    public Specialist Specialist { get; set; } = null!;
    
    public int LicenseTypeId { get; set; }
    public LicenseType LicenseType { get; set; } = null!;
}
