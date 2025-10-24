namespace DigitalEngineers.Infrastructure.Entities;

public class LicenseType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ProfessionId { get; set; }
    
    public Profession Profession { get; set; } = null!;
}
