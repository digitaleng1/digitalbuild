using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

using User = ApplicationUser;

/// <summary>
/// Project task entity - main task table
/// </summary>
public class ProjectTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsMilestone { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Foreign keys
    public string? AssignedToUserId { get; set; }
    public int ProjectId { get; set; }
    public string CreatedByUserId { get; set; } = string.Empty;
    public int? ParentTaskId { get; set; }
    public int StatusId { get; set; }

    // Navigation properties
    public User? AssignedToUser { get; set; }
    public Project Project { get; set; } = null!;
    public User CreatedByUser { get; set; } = null!;
    public ProjectTask? ParentTask { get; set; }
    public TaskStatus Status { get; set; } = null!;
    
    // Child relationships
    public ICollection<ProjectTask> ChildTasks { get; set; } = new List<ProjectTask>();
    public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
    public ICollection<TaskAttachment> Attachments { get; set; } = new List<TaskAttachment>();
    public ICollection<TaskWatcher> Watchers { get; set; } = new List<TaskWatcher>();
    public ICollection<TaskLabel> TaskLabels { get; set; } = new List<TaskLabel>();
    public ICollection<TaskAuditLog> AuditLogs { get; set; } = new List<TaskAuditLog>();
}
