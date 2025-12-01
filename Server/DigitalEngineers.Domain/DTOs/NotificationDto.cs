namespace DigitalEngineers.Domain.DTOs;

public class NotificationDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string SubType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, string>? AdditionalData { get; set; }
    
    public string SenderId { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string? SenderProfilePicture { get; set; }
    
    public bool IsDelivered { get; set; }
    public bool IsRead { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
