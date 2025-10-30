using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class CreateBidResponseViewModel
{
    [Required]
    public int BidRequestId { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string CoverLetter { get; set; } = string.Empty;
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Proposed price must be greater than 0")]
    public decimal ProposedPrice { get; set; }
    
    [Required]
    [Range(1, 365, ErrorMessage = "Estimated days must be between 1 and 365")]
    public int EstimatedDays { get; set; }
}
