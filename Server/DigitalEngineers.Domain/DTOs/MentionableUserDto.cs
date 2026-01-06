namespace DigitalEngineers.Domain.DTOs;

/// <summary>
/// User that can be mentioned in comments
/// </summary>
public class MentionableUserDto
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
}
