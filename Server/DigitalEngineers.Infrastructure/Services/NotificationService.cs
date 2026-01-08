using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace DigitalEngineers.Infrastructure.Services;

using NotificationEntity = Entities.Notification;
using UserDeviceEntity = Entities.UserDevice;

public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<NotificationService> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(
        ApplicationDbContext context,
        ILogger<NotificationService> logger,
        IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
    }

    public async Task SendPushNotificationAsync(
        string receiverUserId,
        NotificationType type,
        NotificationSubType subType,
        string title,
        string body,
        Dictionary<string, string>? additionalData = null,
        CancellationToken cancellationToken = default)
    {
        var notification = new NotificationEntity
        {
            Type = type,
            SubType = subType,
            Title = title,
            Body = body,
            AdditionalData = additionalData != null ? JsonConvert.SerializeObject(additionalData) : null,
            SenderId = null,
            ReceiverId = receiverUserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync(cancellationToken);

        try
        {
            var notificationDto = new NotificationDto
            {
                Id = notification.Id,
                Type = type.ToString(),
                SubType = subType.ToString(),
                Title = title,
                Body = body,
                AdditionalData = additionalData,
                SenderId = "system",
                SenderName = "System",
                SenderProfilePicture = null,
                IsDelivered = false,
                IsRead = false,
                DeliveredAt = null,
                ReadAt = null,
                CreatedAt = notification.CreatedAt
            };

            await _hubContext.Clients.Group(receiverUserId)
                .SendAsync("ReceiveNotification", notificationDto, cancellationToken);

            _logger.LogInformation("SignalR notification sent to user {UserId}", receiverUserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SignalR notification to user {UserId}", receiverUserId);
        }
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(
        string userId,
        int skip = 0,
        int take = 20,
        CancellationToken cancellationToken = default)
    {
        var notifications = await _context.Notifications
            .Include(n => n.Sender)
            .Where(n => n.ReceiverId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);

        return notifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            Type = n.Type.ToString(),
            SubType = n.SubType.ToString(),
            Title = n.Title,
            Body = n.Body,
            AdditionalData = !string.IsNullOrEmpty(n.AdditionalData) 
                ? JsonConvert.DeserializeObject<Dictionary<string, string>>(n.AdditionalData)
                : null,
            SenderId = n.SenderId ?? "system",
            SenderName = n.Sender != null ? $"{n.Sender.FirstName} {n.Sender.LastName}" : "System",
            SenderProfilePicture = n.Sender?.ProfilePictureUrl,
            IsDelivered = n.IsDelivered,
            IsRead = n.IsRead,
            DeliveredAt = n.DeliveredAt,
            ReadAt = n.ReadAt,
            CreatedAt = n.CreatedAt
        });
    }

    public async Task<int> GetUnreadCountAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .Where(n => n.ReceiverId == userId && !n.IsRead)
            .CountAsync(cancellationToken);
    }

    public async Task MarkAsReadAsync(
        int notificationId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.ReceiverId == userId, cancellationToken);

        if (notification != null && !notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task MarkAllAsReadAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var notifications = _context.Notifications
            .Where(n => n.ReceiverId == userId && !n.IsRead);

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task MarkAsDeliveredAsync(
        int notificationId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.ReceiverId == userId, cancellationToken);

        if (notification != null && !notification.IsDelivered)
        {
            notification.IsDelivered = true;
            notification.DeliveredAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task DeleteNotificationAsync(
        int notificationId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.ReceiverId == userId, cancellationToken);

        if (notification != null)
        {
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task SaveFcmTokenAsync(
        string userId,
        string fcmToken,
        string? deviceType = null,
        string? deviceName = null,
        string? userAgent = null,
        CancellationToken cancellationToken = default)
    {
        var existingDevice = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.FcmToken == fcmToken, cancellationToken);
        
        if (existingDevice != null)
        {
            existingDevice.LastUsedAt = DateTime.UtcNow;
            existingDevice.IsActive = true;
        }
        else
        {
            var device = new UserDeviceEntity
            {
                UserId = userId,
                FcmToken = fcmToken,
                DeviceType = deviceType,
                DeviceName = deviceName,
                UserAgent = userAgent,
                CreatedAt = DateTime.UtcNow,
                LastUsedAt = DateTime.UtcNow,
                IsActive = true
            };
            
            _context.UserDevices.Add(device);
        }
        
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task RemoveFcmTokenAsync(
        string userId,
        string fcmToken,
        CancellationToken cancellationToken = default)
    {
        var device = await _context.UserDevices
            .FirstOrDefaultAsync(d => d.UserId == userId && d.FcmToken == fcmToken, cancellationToken);
        
        if (device != null)
        {
            _context.UserDevices.Remove(device);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
    
    public async Task<IEnumerable<UserDeviceDto>> GetUserDevicesAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var devices = await _context.UserDevices
            .Where(d => d.UserId == userId && d.IsActive)
            .OrderByDescending(d => d.LastUsedAt)
            .ToListAsync(cancellationToken);
        
        return devices.Select(d => new UserDeviceDto
        {
            Id = d.Id,
            DeviceType = d.DeviceType,
            DeviceName = d.DeviceName,
            CreatedAt = d.CreatedAt,
            LastUsedAt = d.LastUsedAt
        });
    }
}
