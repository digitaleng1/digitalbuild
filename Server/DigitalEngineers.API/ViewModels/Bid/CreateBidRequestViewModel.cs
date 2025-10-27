using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class CreateBidRequestViewModel
{
    [Required]
    public int ProjectId { get; set; }
    
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    
    [Range(0, double.MaxValue)]
    public decimal? BudgetMin { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? BudgetMax { get; set; }
    
    public DateTime? Deadline { get; set; }
}
