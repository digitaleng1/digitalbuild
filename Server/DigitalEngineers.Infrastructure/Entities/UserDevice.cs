using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// User device for push notifications
/// Supports multiple devices per user
/// </summary>
public class UserDevice
{
    public int Id { get; set; }
    
    // User relationship
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    // FCM Token
    public string FcmToken { get; set; } = string.Empty;
    
    // Device info (optional, for identification)
    public string? DeviceType { get; set; }
    public string? DeviceName { get; set; }
    public string? UserAgent { get; set; }
    
    // Tracking
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
