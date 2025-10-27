using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class CreateBidResponseViewModel
{
    [Required]
    public int BidRequestId { get; set; }
    
    [Required]
    public int SpecialistId { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string CoverLetter { get; set; } = string.Empty;
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal ProposedPrice { get; set; }
    
    [Required]
    [Range(1, 365)]
    public int EstimatedDays { get; set; }
}
