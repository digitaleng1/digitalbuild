using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class CreateBidMessageViewModel
{
    [Required]
    public int BidResponseId { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string MessageText { get; set; } = string.Empty;
}
