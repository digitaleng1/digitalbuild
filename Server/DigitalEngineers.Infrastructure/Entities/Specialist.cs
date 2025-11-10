using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Specialist entity - extends ApplicationUser with specialist-specific data
/// </summary>
public class Specialist
{
    public int Id { get; set; }
    
    // 1:1 relationship with ApplicationUser
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    // Professional Information
    public int YearsOfExperience { get; set; }
    public decimal? HourlyRate { get; set; }
    public double Rating { get; set; } = 0;
    public bool IsAvailable { get; set; } = true;
    public string? Specialization { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Relationships
    public ICollection<SpecialistLicenseType> LicenseTypes { get; set; } = [];
    public ICollection<ProjectSpecialist> AssignedProjects { get; set; } = [];
    public ICollection<PortfolioItem> Portfolio { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
}
