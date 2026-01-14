using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Project;

public class UpdateProjectProfessionTypesViewModel
{
    [Required]
    [MinLength(1, ErrorMessage = "At least one profession type must be selected")]
    public List<int> ProfessionTypeIds { get; set; } = new();
}
