using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class CreateBidMessageViewModel
{
    [Required]
    public int BidRequestId { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string MessageText { get; set; } = string.Empty;
}
