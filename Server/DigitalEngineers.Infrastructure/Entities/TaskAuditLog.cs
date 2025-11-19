using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

using User = ApplicationUser;

/// <summary>
/// Task audit log entity - history of all task changes
/// </summary>
public class TaskAuditLog
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? FieldName { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ProjectTask Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
