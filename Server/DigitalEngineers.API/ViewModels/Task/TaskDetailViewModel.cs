using DigitalEngineers.API.ViewModels.TaskComment;
using DigitalEngineers.API.ViewModels.TaskAttachment;
using DigitalEngineers.API.ViewModels.TaskWatcher;
using DigitalEngineers.API.ViewModels.TaskLabel;
using DigitalEngineers.API.ViewModels.TaskAuditLog;
using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.API.ViewModels.Task;

public class TaskDetailViewModel
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
    
    public TaskCommentViewModel[] Comments { get; set; } = [];
    public TaskAttachmentViewModel[] Attachments { get; set; } = [];
    public TaskWatcherViewModel[] Watchers { get; set; } = [];
    public TaskLabelViewModel[] Labels { get; set; } = [];
    public TaskViewModel[] ChildTasks { get; set; } = [];
    public TaskAuditLogViewModel[] AuditLogs { get; set; } = [];
}
