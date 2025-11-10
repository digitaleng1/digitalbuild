using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Specialist;

public class UpdateSpecialistViewModel
{
    [MaxLength(100)]
    public string? FirstName { get; set; }
    
    [MaxLength(100)]
    public string? LastName { get; set; }
    
    [MaxLength(2000)]
    public string? Biography { get; set; }
    
    [MaxLength(200)]
    public string? Location { get; set; }
    
    [MaxLength(500)]
    [Url]
    public string? Website { get; set; }
    
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
