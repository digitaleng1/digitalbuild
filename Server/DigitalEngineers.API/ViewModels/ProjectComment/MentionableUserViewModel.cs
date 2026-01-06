namespace DigitalEngineers.API.ViewModels.ProjectComment;

/// <summary>
/// View model for users that can be mentioned in comments
/// </summary>
public class MentionableUserViewModel
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
}
