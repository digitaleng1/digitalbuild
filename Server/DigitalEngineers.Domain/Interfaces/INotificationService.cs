using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.Interfaces;

public interface INotificationService
{
    Task SendPushNotificationAsync(
        string receiverUserId,
        NotificationType type,
        NotificationSubType subType,
        string title,
        string body,
        Dictionary<string, string>? additionalData = null,
        CancellationToken cancellationToken = default);
    
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(
        string userId,
        int skip = 0,
        int take = 20,
        CancellationToken cancellationToken = default);
    
    Task<int> GetUnreadCountAsync(
        string userId,
        CancellationToken cancellationToken = default);
    
    Task MarkAsReadAsync(
        int notificationId,
        string userId,
        CancellationToken cancellationToken = default);
    
    Task MarkAllAsReadAsync(
        string userId,
        CancellationToken cancellationToken = default);
    
    Task MarkAsDeliveredAsync(
        int notificationId,
        string userId,
        CancellationToken cancellationToken = default);
    
    Task DeleteNotificationAsync(
        int notificationId,
        string userId,
        CancellationToken cancellationToken = default);
    
    Task SaveFcmTokenAsync(
        string userId,
        string fcmToken,
        string? deviceType = null,
        string? deviceName = null,
        string? userAgent = null,
        CancellationToken cancellationToken = default);
    
    Task RemoveFcmTokenAsync(
        string userId,
        string fcmToken,
        CancellationToken cancellationToken = default);
    
    Task<IEnumerable<UserDeviceDto>> GetUserDevicesAsync(
        string userId,
        CancellationToken cancellationToken = default);
}
