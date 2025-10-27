namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Portfolio item entity for Specialist
/// </summary>
public class PortfolioItem
{
    public int Id { get; set; }
    
    public int SpecialistId { get; set; }
    public Specialist Specialist { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? ProjectUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
