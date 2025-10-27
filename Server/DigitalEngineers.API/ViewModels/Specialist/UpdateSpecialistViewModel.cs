using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Specialist;

public class UpdateSpecialistViewModel
{
    [Required]
    [Range(0, 100)]
    public int YearsOfExperience { get; set; }
    
    [Range(0, 1000000)]
    public decimal? HourlyRate { get; set; }
    
    [Required]
    public bool IsAvailable { get; set; }
    
    [MaxLength(500)]
    public string? Specialization { get; set; }
    
    [Required]
    public int[] LicenseTypeIds { get; set; } = [];
}
