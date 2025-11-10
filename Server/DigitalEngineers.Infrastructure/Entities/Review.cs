namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Review entity - client reviews for specialists
/// </summary>
public class Review
{
    public int Id { get; set; }
    
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public string ClientId { get; set; } = string.Empty;
    public Identity.ApplicationUser Client { get; set; } = null!;
    
    public int SpecialistId { get; set; }
    public Specialist Specialist { get; set; } = null!;
    
    public int Rating { get; set; } // 1-5 stars
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
