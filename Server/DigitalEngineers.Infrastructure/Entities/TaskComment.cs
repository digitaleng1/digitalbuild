using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

using User = ApplicationUser;

/// <summary>
/// Task comment entity - internal task communication
/// </summary>
public class TaskComment
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsEdited { get; set; }

    // Navigation properties
    public ProjectTask Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
