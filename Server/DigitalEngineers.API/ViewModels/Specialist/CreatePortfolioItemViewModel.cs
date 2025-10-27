using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Specialist;

public class CreatePortfolioItemViewModel
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? ProjectUrl { get; set; }
}
