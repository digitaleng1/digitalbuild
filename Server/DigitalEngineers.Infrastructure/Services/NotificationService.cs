using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Configuration;
using DigitalEngineers.Infrastructure.Data;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace DigitalEngineers.Infrastructure.Services;

using NotificationEntity = Entities.Notification;
using UserDeviceEntity = Entities.UserDevice;

public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<NotificationService> _logger;
    private readonly FirebaseSettings _firebaseSettings;
    private static GoogleCredential? _cachedCredential;
    private static readonly object _lock = new();
    private bool _isFirebaseInitialized;

    public NotificationService(
        ApplicationDbContext context,
        ILogger<NotificationService> logger,
        IOptions<FirebaseSettings> firebaseSettings)
    {
        _context = context;
        _logger = logger;
        _firebaseSettings = firebaseSettings.Value;
        
        InitializeFirebase();
    }

    private void InitializeFirebase()
    {
        if (FirebaseApp.DefaultInstance != null)
        {
            _isFirebaseInitialized = true;
            return;
        }

        try
        {
            if (string.IsNullOrEmpty(_firebaseSettings.ServiceAccountKeyPath))
            {
                _logger.LogWarning("Firebase ServiceAccountKeyPath not configured. Push notifications will be disabled.");
                _isFirebaseInitialized = false;
                return;
            }

            GoogleCredential credential;
            
            lock (_lock)
            {
                if (_cachedCredential == null)
                {
                    var fullPath = Path.GetFullPath(_firebaseSettings.ServiceAccountKeyPath);
                    
                    if (!File.Exists(fullPath))
                    {
                        _logger.LogError("Firebase service account file not found at: {Path}", fullPath);
                        _isFirebaseInitialized = false;
                        return;
                    }

                    _cachedCredential = GoogleCredential.FromFile(fullPath);
                }
                
                credential = _cachedCredential;
            }
            
            FirebaseApp.Create(new AppOptions
            {
                Credential = credential,
                ProjectId = _firebaseSettings.ProjectId
            });
            
            _isFirebaseInitialized = true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize Firebase. Push notifications will be disabled.");
            _isFirebaseInitialized = false;
        }
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

        if (!_isFirebaseInitialized)
        {
            _logger.LogWarning("Firebase not initialized. Skipping FCM notification for user {UserId}", receiverUserId);
            return;
        }

        var fcmTokens = await _context.UserDevices
            .Where(d => d.UserId == receiverUserId && d.IsActive)
            .Select(d => d.FcmToken)
            .ToListAsync(cancellationToken);

        if (fcmTokens.Any())
        {
            var message = new Message
            {
                Notification = new FirebaseAdmin.Messaging.Notification
                {
                    Title = title,
                    Body = body
                },
                Data = new Dictionary<string, string>
                {
                    { "notificationId", notification.Id.ToString() },
                    { "type", type.ToString() },
                    { "subType", subType.ToString() },
                    { "additionalData", notification.AdditionalData ?? "{}" }
                }
            };
            
            var results = new List<string>();
            var errors = new List<string>();
            
            foreach (var token in fcmTokens)
            {
                try
                {
                    message.Token = token;
                    string messageId = await FirebaseMessaging.DefaultInstance.SendAsync(message, cancellationToken);
                    results.Add($"Sent to {token[..10]}... - MessageId: {messageId}");
                }
                catch (FirebaseMessagingException ex) when (ex.MessagingErrorCode == MessagingErrorCode.Unregistered)
                {
                    await RemoveFcmTokenAsync(receiverUserId, token, cancellationToken);
                    _logger.LogWarning("Removed invalid FCM token for user {UserId}", receiverUserId);
                    errors.Add($"Token {token[..10]}... unregistered and removed");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send FCM notification to token {Token}", token[..10]);
                    errors.Add($"Token {token[..10]}... failed: {ex.Message}");
                }
            }
            
            if (results.Any())
                _logger.LogWarning("FCM sent successfully: {Results}", string.Join(", ", results));
            
            if (errors.Any())
                _logger.LogWarning("FCM errors: {Errors}", string.Join(", ", errors));
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
        var notifications = await _context.Notifications
            .Where(n => n.ReceiverId == userId && !n.IsRead)
            .ToListAsync(cancellationToken);

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
