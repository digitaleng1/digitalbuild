namespace DigitalEngineers.Domain.DTOs;

public class CreateBidMessageDto
{
    public int BidRequestId { get; init; }
    public string SenderId { get; init; } = string.Empty;
    public string MessageText { get; init; } = string.Empty;
}
