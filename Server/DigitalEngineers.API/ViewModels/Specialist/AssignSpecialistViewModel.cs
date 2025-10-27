using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Specialist;

public class AssignSpecialistViewModel
{
    [Required]
    public int SpecialistId { get; set; }
    
    [MaxLength(100)]
    public string? Role { get; set; }
}
