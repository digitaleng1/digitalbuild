namespace DigitalEngineers.Infrastructure.Entities;

public class ProfessionTypeLicenseRequirement
{
    public int Id { get; set; }
    public int ProfessionTypeId { get; set; }
    public int LicenseTypeId { get; set; }
    public bool IsRequired { get; set; }
    public string? Notes { get; set; }
    
    // Navigation properties
    public ProfessionType ProfessionType { get; set; } = null!;
    public LicenseType LicenseType { get; set; } = null!;
}
