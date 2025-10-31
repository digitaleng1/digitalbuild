using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class AcceptBidResponseViewModel
{
    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Admin markup percentage must be non-negative")]
    public decimal AdminMarkupPercentage { get; set; } = 20;
    
    [MaxLength(1000)]
    public string? AdminComment { get; set; }
}
