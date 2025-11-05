namespace DigitalEngineers.API.ViewModels.Bid;

public class BidMessageViewModel
{
    public int Id { get; set; }
    public int BidRequestId { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string? SenderProfilePictureUrl { get; set; }
    public string MessageText { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
