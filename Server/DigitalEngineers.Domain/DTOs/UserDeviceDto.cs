namespace DigitalEngineers.Domain.DTOs;

public class UserDeviceDto
{
    public int Id { get; set; }
    public string? DeviceType { get; set; }
    public string? DeviceName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastUsedAt { get; set; }
}
