using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Project;

/// <summary>
/// ViewModel for changing project client (Admin only)
/// </summary>
public class ChangeProjectClientViewModel
{
    [Required(ErrorMessage = "Client ID is required")]
    public string ClientId { get; set; } = string.Empty;
}
