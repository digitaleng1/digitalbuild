using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Project;

public class CreateProjectViewModel
{
    [Required(ErrorMessage = "Project name is required")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "Project name must be between 3 and 200 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "At least one license type is required")]
    [MinLength(1, ErrorMessage = "At least one license type must be selected")]
    public int[] LicenseTypeIds { get; set; } = [];

    [Required(ErrorMessage = "Street address is required")]
    [StringLength(300, ErrorMessage = "Street address cannot exceed 300 characters")]
    public string StreetAddress { get; set; } = string.Empty;

    [Required(ErrorMessage = "City is required")]
    [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "State is required")]
    [StringLength(2, MinimumLength = 2, ErrorMessage = "State must be 2 characters")]
    public string State { get; set; } = string.Empty;

    [Required(ErrorMessage = "ZIP code is required")]
    [RegularExpression(@"^\d{5}(-\d{4})?$", ErrorMessage = "Invalid ZIP code format")]
    public string ZipCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Project scope is required")]
    [RegularExpression(@"^(1-3|less-6|greater-6)$", ErrorMessage = "Invalid project scope")]
    public string ProjectScope { get; set; } = string.Empty;

    [Required(ErrorMessage = "Project description is required")]
    [StringLength(5000, MinimumLength = 50, ErrorMessage = "Description must be between 50 and 5000 characters")]
    public string Description { get; set; } = string.Empty;

    public string[] DocumentUrls { get; set; } = [];
}
