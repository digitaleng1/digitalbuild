namespace DigitalEngineers.Domain.DTOs;

public class UpdateClientProfileDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    
    // Company Info
    public string? CompanyName { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? CompanyDescription { get; set; }
    
    // Contact Info (ApplicationUser)
    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }
}
