using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Client;

public class UpdateClientProfileViewModel
{
    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "Company name cannot exceed 100 characters")]
    public string? CompanyName { get; set; }

    [StringLength(50, ErrorMessage = "Industry cannot exceed 50 characters")]
    public string? Industry { get; set; }

    [Url(ErrorMessage = "Invalid website URL")]
    [StringLength(200, ErrorMessage = "Website URL cannot exceed 200 characters")]
    public string? Website { get; set; }

    [StringLength(500, ErrorMessage = "Company description cannot exceed 500 characters")]
    public string? CompanyDescription { get; set; }

    [Phone(ErrorMessage = "Invalid phone number")]
    [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
    public string? PhoneNumber { get; set; }

    [StringLength(100, ErrorMessage = "Location cannot exceed 100 characters")]
    public string? Location { get; set; }
}
