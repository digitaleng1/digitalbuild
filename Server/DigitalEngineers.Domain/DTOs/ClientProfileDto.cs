namespace DigitalEngineers.Domain.DTOs;

public class ClientProfileDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    
    // Company Info
    public string? CompanyName { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? CompanyDescription { get; set; }
    
    // Contact Info (from ApplicationUser)
    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }
    
    // Stats
    public ClientStatsDto Stats { get; set; } = new();
    
    public DateTime CreatedAt { get; set; }
}
