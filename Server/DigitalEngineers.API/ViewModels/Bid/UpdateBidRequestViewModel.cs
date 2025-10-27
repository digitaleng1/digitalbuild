using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class UpdateBidRequestViewModel
{
    [MaxLength(300)]
    public string? Title { get; set; }
    
    [MaxLength(2000)]
    public string? Description { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? BudgetMin { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? BudgetMax { get; set; }
    
    public DateTime? Deadline { get; set; }
    
    public string? Status { get; set; }
}
