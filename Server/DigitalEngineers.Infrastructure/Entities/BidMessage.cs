namespace DigitalEngineers.Infrastructure.Entities;

public class BidMessage
{
    public int Id { get; set; }
    
    public int BidResponseId { get; set; }
    public BidResponse BidResponse { get; set; } = null!;
    
    public string SenderId { get; set; } = string.Empty;
    public string MessageText { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
