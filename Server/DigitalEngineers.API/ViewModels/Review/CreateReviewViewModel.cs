using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Review;

public class CreateReviewViewModel
{
    [Required]
    public int ProjectId { get; set; }
    
    [Required]
    public int SpecialistId { get; set; }
    
    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }
    
    [Required]
    [MaxLength(2000, ErrorMessage = "Comment cannot exceed 2000 characters")]
    public string Comment { get; set; } = string.Empty;
}
