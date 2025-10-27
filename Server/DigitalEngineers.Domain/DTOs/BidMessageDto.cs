namespace DigitalEngineers.Domain.DTOs;

public class BidMessageDto
{
    public int Id { get; set; }
    public int BidResponseId { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string MessageText { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
