using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.User;

public class UserProfileViewModel
{
    public string UserId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }
    public string? Biography { get; set; }
    public string? Website { get; set; }
    public IEnumerable<string> Roles { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime? LastActive { get; set; }
}

public class UpdateUserProfileViewModel
{
    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string FirstName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string LastName { get; set; } = string.Empty;
    
    [Phone(ErrorMessage = "Invalid phone number")]
    [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
    public string? PhoneNumber { get; set; }
    
    [StringLength(100, ErrorMessage = "Location cannot exceed 100 characters")]
    public string? Location { get; set; }
    
    [StringLength(500, ErrorMessage = "Biography cannot exceed 500 characters")]
    public string? Biography { get; set; }
    
    [Url(ErrorMessage = "Invalid website URL")]
    [StringLength(200, ErrorMessage = "Website URL cannot exceed 200 characters")]
    public string? Website { get; set; }
}
