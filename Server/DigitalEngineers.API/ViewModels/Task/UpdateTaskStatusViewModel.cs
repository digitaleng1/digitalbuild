using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Task;

public class UpdateTaskStatusViewModel
{
    [Required(ErrorMessage = "Name is required")]
    [MaxLength(100, ErrorMessage = "Name must not exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Color is required")]
    [RegularExpression("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Color must be a valid hex color code")]
    public string Color { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }
}
