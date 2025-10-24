using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Infrastructure.Entities;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; } = ProjectStatus.Draft;
    
    // Client relationship
    public string ClientId { get; set; } = string.Empty;
    
    // Location
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    
    // Project details
    public ProjectScope ProjectScope { get; set; }
    public List<string> DocumentUrls { get; set; } = [];
    public string? ThumbnailUrl { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Relationships
    public ICollection<ProjectLicenseType> ProjectLicenseTypes { get; set; } = [];
    public ICollection<ProjectFile> Files { get; set; } = [];
}
