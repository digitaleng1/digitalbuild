using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications(
        [FromQuery] int skip = 0,
        [FromQuery] int take = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var notifications = await _notificationService.GetUserNotificationsAsync(userId, skip, take, cancellationToken);
        return Ok(notifications);
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount(CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var count = await _notificationService.GetUnreadCountAsync(userId, cancellationToken);
        return Ok(count);
    }

    [HttpPut("{id}/mark-read")]
    public async Task<IActionResult> MarkAsRead(int id, CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _notificationService.MarkAsReadAsync(id, userId, cancellationToken);
        return NoContent();
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _notificationService.MarkAllAsReadAsync(userId, cancellationToken);
        return NoContent();
    }

    [HttpPut("{id}/mark-delivered")]
    public async Task<IActionResult> MarkAsDelivered(int id, CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _notificationService.MarkAsDeliveredAsync(id, userId, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(int id, CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _notificationService.DeleteNotificationAsync(id, userId, cancellationToken);
        return NoContent();
    }

    [HttpPost("fcm-token")]
    public async Task<IActionResult> SaveFcmToken(
        [FromBody] SaveFcmTokenDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _notificationService.SaveFcmTokenAsync(
            userId, 
            dto.FcmToken,
            dto.DeviceType,
            dto.DeviceName,
            dto.UserAgent,
            cancellationToken);
        return NoContent();
    }

    [HttpDelete("fcm-token")]
    public async Task<IActionResult> RemoveFcmToken(
        [FromBody] RemoveFcmTokenDto dto,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _notificationService.RemoveFcmTokenAsync(userId, dto.FcmToken, cancellationToken);
        return NoContent();
    }

    [HttpGet("devices")]
    public async Task<ActionResult<IEnumerable<UserDeviceDto>>> GetDevices(
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var devices = await _notificationService.GetUserDevicesAsync(userId, cancellationToken);
        return Ok(devices);
    }

    [HttpPost("test-send")]
    public async Task<IActionResult> SendTestNotification(CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        
        await _notificationService.SendPushNotificationAsync(
            userId,
            Domain.Enums.NotificationType.System,
            Domain.Enums.NotificationSubType.WelcomeMessage,
            "Test Notification",
            "This is a test notification sent from API",
            null,
            cancellationToken);
        
        return Ok(new { message = "Test notification sent successfully" });
    }
}
