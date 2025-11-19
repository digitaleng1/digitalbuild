namespace DigitalEngineers.API.ViewModels.TaskWatcher;

public class TaskWatcherViewModel
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? UserEmail { get; set; }
    public string? UserProfilePictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
