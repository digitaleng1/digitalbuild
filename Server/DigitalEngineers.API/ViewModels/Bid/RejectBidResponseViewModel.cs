using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class RejectBidResponseViewModel
{
    [MaxLength(500)]
    public string? Reason { get; set; }
}
