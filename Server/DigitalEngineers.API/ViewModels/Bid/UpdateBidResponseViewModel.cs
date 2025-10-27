using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class UpdateBidResponseViewModel
{
    [MaxLength(2000)]
    public string? CoverLetter { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? ProposedPrice { get; set; }
    
    [Range(1, 365)]
    public int? EstimatedDays { get; set; }
}
