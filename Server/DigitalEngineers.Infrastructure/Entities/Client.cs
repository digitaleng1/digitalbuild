using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Client entity - extends ApplicationUser with client-specific data
/// </summary>
public class Client
{
    public int Id { get; set; }
    
    // 1:1 relationship with ApplicationUser
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    // Company Information
    public string? CompanyName { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? CompanyDescription { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Relationships
    public ICollection<Project> Projects { get; set; } = [];
}
