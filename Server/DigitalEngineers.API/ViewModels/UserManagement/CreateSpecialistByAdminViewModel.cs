using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.UserManagement;

public class CreateSpecialistByAdminViewModel
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public string Password { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }
    
    [Required(ErrorMessage = "At least one profession type is required")]
    [MinLength(1, ErrorMessage = "At least one profession type is required")]
    public int[] ProfessionTypeIds { get; set; } = [];
}
