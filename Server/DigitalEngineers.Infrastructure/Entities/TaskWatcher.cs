using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

using User = ApplicationUser;

/// <summary>
/// Task watcher entity - task subscribers for notifications
/// </summary>
public class TaskWatcher
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ProjectTask Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
