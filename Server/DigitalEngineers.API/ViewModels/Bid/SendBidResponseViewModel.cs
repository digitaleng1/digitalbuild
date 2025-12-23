namespace DigitalEngineers.API.ViewModels.Bid;

public class SendBidResponseViewModel
{
    public string Message { get; set; } = string.Empty;
    public IEnumerable<int> BidRequestIds { get; set; } = [];
}
