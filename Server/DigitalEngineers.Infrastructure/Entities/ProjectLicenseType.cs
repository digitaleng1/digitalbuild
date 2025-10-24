namespace DigitalEngineers.Infrastructure.Entities;

public class ProjectLicenseType
{
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public int LicenseTypeId { get; set; }
    public LicenseType LicenseType { get; set; } = null!;
}
