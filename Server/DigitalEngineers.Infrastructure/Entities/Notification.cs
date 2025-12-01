using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

public class Notification
{
    public int Id { get; set; }
    
    // Notification type and subtype
    public NotificationType Type { get; set; }
    public NotificationSubType SubType { get; set; }
    
    // Message content
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    
    // Additional data (JSON)
    public string? AdditionalData { get; set; }
    
    // Sender and receiver (SenderId is nullable for system notifications)
    public string? SenderId { get; set; }
    public string ReceiverId { get; set; } = string.Empty;
    
    // Status tracking
    public bool IsDelivered { get; set; } = false;
    public bool IsRead { get; set; } = false;
    public DateTime? DeliveredAt { get; set; }
    public DateTime? ReadAt { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ApplicationUser? Sender { get; set; }
    public ApplicationUser Receiver { get; set; } = null!;
}
