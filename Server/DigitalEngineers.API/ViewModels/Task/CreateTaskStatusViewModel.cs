using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Task;

public class CreateTaskStatusViewModel
{
    [Required(ErrorMessage = "Project ID is required")]
    public int ProjectId { get; init; }

    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, ErrorMessage = "Name must not exceed 100 characters")]
    public string Name { get; init; } = string.Empty;

    [Required(ErrorMessage = "Color is required")]
    [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Invalid hex color format")]
    public string Color { get; init; } = "#6c757d";

    [Range(1, int.MaxValue, ErrorMessage = "Order must be greater than 0")]
    public int Order { get; init; }

    public bool IsCompleted { get; init; } = false;
}
