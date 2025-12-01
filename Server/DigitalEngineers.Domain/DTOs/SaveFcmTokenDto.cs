namespace DigitalEngineers.Domain.DTOs;

public class SaveFcmTokenDto
{
    public string FcmToken { get; set; } = string.Empty;
    public string? DeviceType { get; set; }
    public string? DeviceName { get; set; }
    public string? UserAgent { get; set; }
}
