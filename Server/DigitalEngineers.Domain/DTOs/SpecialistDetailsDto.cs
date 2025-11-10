namespace DigitalEngineers.Domain.DTOs;

public class SpecialistDetailsDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    
    // User data
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Biography { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    
    // Specialist data
    public int YearsOfExperience { get; set; }
    public decimal? HourlyRate { get; set; }
    public double Rating { get; set; }
    public bool IsAvailable { get; set; }
    public string? Specialization { get; set; }
    
    // Related data
    public int[] LicenseTypeIds { get; set; } = [];
    public LicenseTypeDto[] LicenseTypes { get; set; } = [];
    public PortfolioItemDto[] Portfolio { get; set; } = [];
    public AssignedProjectDto[] AssignedProjects { get; set; } = [];
    public ReviewDto[] Reviews { get; set; } = [];
    public SpecialistStatsDto? Stats { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
