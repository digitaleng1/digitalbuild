namespace DigitalEngineers.Infrastructure.Entities;

public class Profession
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public ICollection<LicenseType> LicenseTypes { get; set; } = new List<LicenseType>();
}
