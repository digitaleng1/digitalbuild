using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Project;

public class UpdateProjectStatusViewModel
{
    [Required(ErrorMessage = "Status is required")]
    public string Status { get; set; } = string.Empty;
}
