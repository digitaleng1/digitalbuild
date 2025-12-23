using DigitalEngineers.Domain.DTOs.TaskComment;
using DigitalEngineers.Domain.DTOs.TaskAttachment;
using DigitalEngineers.Domain.DTOs.TaskWatcher;
using DigitalEngineers.Domain.DTOs.TaskLabel;
using DigitalEngineers.Domain.DTOs.TaskAuditLog;
using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.DTOs.Task;

public class TaskDetailDto
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
    
    public string? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
    public string? AssignedToUserAvatar { get; set; }
    public string? AssignedToUserEmail { get; set; }
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string CreatedByUserId { get; set; } = string.Empty;
    public string CreatedByUserName { get; set; } = string.Empty;
    public int? ParentTaskId { get; set; }
    public string? ParentTaskTitle { get; set; }
    public int StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? StatusColor { get; set; }
    
    public TaskCommentDto[] Comments { get; set; } = [];
    public TaskAttachmentDto[] Attachments { get; set; } = [];
    public TaskWatcherDto[] Watchers { get; set; } = [];
    public TaskLabelDto[] Labels { get; set; } = [];
    public TaskDto[] ChildTasks { get; set; } = [];
    public TaskAuditLogDto[] AuditLogs { get; set; } = [];
}
