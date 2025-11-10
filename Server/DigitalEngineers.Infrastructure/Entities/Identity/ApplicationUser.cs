using Microsoft.AspNetCore.Identity;

namespace DigitalEngineers.Infrastructure.Entities.Identity;

public class ApplicationUser : IdentityUser
{
    // Basic Info
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    
    // Professional Profile
    public string? ProfilePictureUrl { get; set; }
    public string? Biography { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    
    // Activity Tracking
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastActive { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Authentication
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public DateTime? LastLoginAt { get; set; }
}
