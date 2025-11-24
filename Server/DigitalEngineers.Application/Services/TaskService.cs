using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.DTOs.Task;
using DigitalEngineers.Domain.DTOs.TaskComment;
using DigitalEngineers.Domain.DTOs.TaskAttachment;
using DigitalEngineers.Domain.DTOs.TaskWatcher;
using DigitalEngineers.Domain.DTOs.TaskLabel;
using DigitalEngineers.Domain.DTOs.TaskAuditLog;
using DigitalEngineers.Domain.Enums;
using DigitalEngineers.Domain.Exceptions;
using DigitalEngineers.Domain.Interfaces;
using DigitalEngineers.Infrastructure.Data;
using DigitalEngineers.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using ProjectTaskStatusEntity = DigitalEngineers.Infrastructure.Entities.ProjectTaskStatus;

namespace DigitalEngineers.Application.Services;

public class TaskService : ITaskService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<TaskService> _logger;

    public TaskService(
        ApplicationDbContext context,
        IFileStorageService fileStorageService,
        ILogger<TaskService> logger)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, string createdByUserId, CancellationToken cancellationToken = default)
    {
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == dto.ProjectId, cancellationToken);
        if (!projectExists)
            throw new ProjectNotFoundException(dto.ProjectId);

        var statusExists = await _context.Set<ProjectTaskStatusEntity>().AnyAsync(s => s.Id == dto.StatusId, cancellationToken);
        if (!statusExists)
            throw new ValidationException("Invalid status ID");

        if (dto.AssignedToUserId != null)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.AssignedToUserId, cancellationToken);
            if (!userExists)
                throw new ValidationException("Assigned user not found");
        }

        if (dto.ParentTaskId.HasValue)
        {
            var parentExists = await _context.Set<ProjectTask>().AnyAsync(t => t.Id == dto.ParentTaskId.Value, cancellationToken);
            if (!parentExists)
                throw new TaskNotFoundException(dto.ParentTaskId.Value);
        }

        if (dto.LabelIds.Length > 0)
        {
            var existingLabelIds = await _context.ProjectTaskLabels
                .Where(l => dto.LabelIds.Contains(l.Id))
                .Select(l => l.Id)
                .ToListAsync(cancellationToken);

            if (existingLabelIds.Count != dto.LabelIds.Length)
            {
                var invalidIds = dto.LabelIds.Except(existingLabelIds);
                throw new ValidationException($"Invalid label IDs: {string.Join(", ", invalidIds)}");
            }
        }

        var task = new ProjectTask
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Deadline = dto.Deadline?.ToUniversalTime(),
            IsMilestone = dto.IsMilestone,
            AssignedToUserId = dto.AssignedToUserId,
            ProjectId = dto.ProjectId,
            CreatedByUserId = createdByUserId,
            ParentTaskId = dto.ParentTaskId,
            StatusId = dto.StatusId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Set<ProjectTask>().Add(task);
        await _context.SaveChangesAsync(cancellationToken);

        if (dto.LabelIds.Length > 0)
        {
            var taskLabels = dto.LabelIds.Select(labelId => new TaskLabel
            {
                TaskId = task.Id,
                LabelId = labelId,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.TaskLabels.AddRange(taskLabels);
        }

        var watcher = new TaskWatcher
        {
            TaskId = task.Id,
            UserId = createdByUserId,
            CreatedAt = DateTime.UtcNow
        };
        _context.Set<TaskWatcher>().Add(watcher);

        var auditLog = new TaskAuditLog
        {
            TaskId = task.Id,
            UserId = createdByUserId,
            Action = TaskAuditAction.Created.ToString(),
            CreatedAt = DateTime.UtcNow
        };
        _context.Set<TaskAuditLog>().Add(auditLog);

        await _context.SaveChangesAsync(cancellationToken);

        return await MapToTaskDtoAsync(task.Id, cancellationToken);
    }

    public async Task<TaskDetailDto> GetTaskByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var task = await _context.Set<ProjectTask>()
            .Include(t => t.AssignedToUser)
            .Include(t => t.Project)
            .Include(t => t.CreatedByUser)
            .Include(t => t.ParentTask)
            .Include(t => t.Status)
            .Include(t => t.Comments).ThenInclude(c => c.User)
            .Include(t => t.Attachments).ThenInclude(a => a.UploadedByUser)
            .Include(t => t.Watchers).ThenInclude(w => w.User)
            .Include(t => t.TaskLabels).ThenInclude(tl => tl.Label)
            .Include(t => t.ChildTasks).ThenInclude(ct => ct.Status)
            .Include(t => t.AuditLogs).ThenInclude(al => al.User)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (task == null)
            throw new TaskNotFoundException(id);

        return new TaskDetailDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            Deadline = task.Deadline,
            StartedAt = task.StartedAt,
            CompletedAt = task.CompletedAt,
            IsMilestone = task.IsMilestone,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUserName = task.AssignedToUser != null ? $"{task.AssignedToUser.FirstName} {task.AssignedToUser.LastName}" : null,
            AssignedToUserEmail = task.AssignedToUser?.Email,
            ProjectId = task.ProjectId,
            ProjectName = task.Project.Name,
            CreatedByUserId = task.CreatedByUserId,
            CreatedByUserName = $"{task.CreatedByUser.FirstName} {task.CreatedByUser.LastName}",
            ParentTaskId = task.ParentTaskId,
            ParentTaskTitle = task.ParentTask?.Title,
            StatusId = task.StatusId,
            StatusName = task.Status.Name,
            StatusColor = task.Status.Color,
            Comments = task.Comments.Select(c => new TaskCommentDto
            {
                Id = c.Id,
                TaskId = c.TaskId,
                UserId = c.UserId,
                UserName = $"{c.User.FirstName} {c.User.LastName}",
                UserProfilePictureUrl = c.User.ProfilePictureUrl,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                IsEdited = c.IsEdited
            }).ToArray(),
            Attachments = task.Attachments.Select(a => new TaskAttachmentDto
            {
                Id = a.Id,
                TaskId = a.TaskId,
                FileName = a.FileName,
                FileUrl = a.FileUrl,
                FileSize = a.FileSize,
                ContentType = a.ContentType,
                UploadedByUserId = a.UploadedByUserId,
                UploadedByUserName = $"{a.UploadedByUser.FirstName} {a.UploadedByUser.LastName}",
                UploadedAt = a.UploadedAt
            }).ToArray(),
            Watchers = task.Watchers.Select(w => new TaskWatcherDto
            {
                Id = w.Id,
                TaskId = w.TaskId,
                UserId = w.UserId,
                UserName = $"{w.User.FirstName} {w.User.LastName}",
                UserEmail = w.User.Email,
                UserProfilePictureUrl = w.User.ProfilePictureUrl,
                CreatedAt = w.CreatedAt
            }).ToArray(),
            Labels = task.TaskLabels.Select(tl => new TaskLabelDto
            {
                Id = tl.Label.Id,
                Name = tl.Label.Name,
                Color = tl.Label.Color,
                ProjectId = tl.Label.ProjectId,
                CreatedAt = tl.Label.CreatedAt
            }).ToArray(),
            ChildTasks = task.ChildTasks.Select(ct => new TaskDto
            {
                Id = ct.Id,
                Title = ct.Title,
                Priority = ct.Priority,
                Deadline = ct.Deadline,
                IsMilestone = ct.IsMilestone,
                StatusId = ct.StatusId,
                StatusName = ct.Status.Name,
                StatusColor = ct.Status.Color
            }).ToArray(),
            AuditLogs = task.AuditLogs.OrderByDescending(al => al.CreatedAt).Select(al => new TaskAuditLogDto
            {
                Id = al.Id,
                TaskId = al.TaskId,
                UserId = al.UserId,
                UserName = $"{al.User.FirstName} {al.User.LastName}",
                Action = al.Action,
                FieldName = al.FieldName,
                OldValue = al.OldValue,
                NewValue = al.NewValue,
                CreatedAt = al.CreatedAt
            }).ToArray()
        };
    }

    public async Task<IEnumerable<TaskDto>> GetTasksByProjectIdAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var tasks = await _context.Set<ProjectTask>()
            .Include(t => t.AssignedToUser)
            .Include(t => t.Project)
            .Include(t => t.CreatedByUser)
            .Include(t => t.Status)
            .Include(t => t.Comments)
            .Include(t => t.Attachments)
            .Include(t => t.Watchers)
            .Include(t => t.TaskLabels).ThenInclude(tl => tl.Label)
            .Where(t => t.ProjectId == projectId)
            .ToListAsync(cancellationToken);

        return tasks.Select(MapToTaskDto);
    }

    public async Task<IEnumerable<TaskDto>> GetTasksByAssignedUserIdAsync(string userId, CancellationToken cancellationToken = default)
    {
        var tasks = await _context.Set<ProjectTask>()
            .Include(t => t.AssignedToUser)
            .Include(t => t.Project)
            .Include(t => t.CreatedByUser)
            .Include(t => t.Status)
            .Include(t => t.Comments)
            .Include(t => t.Attachments)
            .Include(t => t.Watchers)
            .Include(t => t.TaskLabels).ThenInclude(tl => tl.Label)
            .Where(t => t.AssignedToUserId == userId)
            .ToListAsync(cancellationToken);

        return tasks.Select(MapToTaskDto);
    }

    public async Task<TaskDto> UpdateTaskAsync(int id, UpdateTaskDto dto, string updatedByUserId, CancellationToken cancellationToken = default)
    {
        var task = await _context.Set<ProjectTask>()
            .Include(t => t.Status)
            .Include(t => t.TaskLabels)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (task == null)
            throw new TaskNotFoundException(id);

        var statusExists = await _context.Set<ProjectTaskStatusEntity>().AnyAsync(s => s.Id == dto.StatusId, cancellationToken);
        if (!statusExists)
            throw new ValidationException("Invalid status ID");

        if (dto.AssignedToUserId != null)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.AssignedToUserId, cancellationToken);
            if (!userExists)
                throw new ValidationException("Assigned user not found");
        }

        var oldStatus = task.Status;
        var newStatus = await _context.Set<ProjectTaskStatusEntity>().FindAsync(dto.StatusId);

        var changes = new List<(string Field, string? OldValue, string? NewValue)>();

        if (task.Title != dto.Title)
            changes.Add(("Title", task.Title, dto.Title));
        if (task.Description != dto.Description)
            changes.Add(("Description", task.Description, dto.Description));
        if (task.Priority != dto.Priority)
            changes.Add(("Priority", task.Priority.ToString(), dto.Priority.ToString()));
        if (task.AssignedToUserId != dto.AssignedToUserId)
            changes.Add(("AssignedTo", task.AssignedToUserId, dto.AssignedToUserId));
        if (task.StatusId != dto.StatusId)
            changes.Add(("Status", oldStatus.Name, newStatus?.Name));

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        task.Deadline = dto.Deadline?.ToUniversalTime();
        task.IsMilestone = dto.IsMilestone;
        task.AssignedToUserId = dto.AssignedToUserId;
        task.ParentTaskId = dto.ParentTaskId;
        task.StatusId = dto.StatusId;
        task.UpdatedAt = DateTime.UtcNow;

        if (oldStatus.Id != newStatus?.Id)
        {
            if (newStatus?.Name == "In Progress" && task.StartedAt == null)
                task.StartedAt = DateTime.UtcNow;

            if (newStatus?.IsCompleted == true && task.CompletedAt == null)
                task.CompletedAt = DateTime.UtcNow;
        }

        var currentLabelIds = task.TaskLabels.Select(tl => tl.LabelId).ToList();
        var toRemove = task.TaskLabels.Where(tl => !dto.LabelIds.Contains(tl.LabelId)).ToList();
        var toAdd = dto.LabelIds.Where(labelId => !currentLabelIds.Contains(labelId))
            .Select(labelId => new TaskLabel
            {
                TaskId = task.Id,
                LabelId = labelId,
                CreatedAt = DateTime.UtcNow
            }).ToList();

        _context.TaskLabels.RemoveRange(toRemove);
        _context.TaskLabels.AddRange(toAdd);

        foreach (var (field, oldValue, newValue) in changes)
        {
            var auditLog = new TaskAuditLog
            {
                TaskId = task.Id,
                UserId = updatedByUserId,
                Action = TaskAuditAction.Updated.ToString(),
                FieldName = field,
                OldValue = oldValue,
                NewValue = newValue,
                CreatedAt = DateTime.UtcNow
            };
            _context.Set<TaskAuditLog>().Add(auditLog);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return await MapToTaskDtoAsync(task.Id, cancellationToken);
    }

    public async Task DeleteTaskAsync(int id, string deletedByUserId, CancellationToken cancellationToken = default)
    {
        var task = await _context.Set<ProjectTask>().FindAsync([id], cancellationToken);

        if (task == null)
            throw new TaskNotFoundException(id);

        var auditLog = new TaskAuditLog
        {
            TaskId = task.Id,
            UserId = deletedByUserId,
            Action = TaskAuditAction.Deleted.ToString(),
            CreatedAt = DateTime.UtcNow
        };
        _context.Set<TaskAuditLog>().Add(auditLog);

        _context.Set<ProjectTask>().Remove(task);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<TaskCommentDto> AddCommentAsync(CreateTaskCommentDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var taskExists = await _context.Set<ProjectTask>().AnyAsync(t => t.Id == dto.TaskId, cancellationToken);
        if (!taskExists)
            throw new TaskNotFoundException(dto.TaskId);

        var comment = new TaskComment
        {
            TaskId = dto.TaskId,
            UserId = userId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
            IsEdited = false
        };

        _context.Set<TaskComment>().Add(comment);

        var auditLog = new TaskAuditLog
        {
            TaskId = dto.TaskId,
            UserId = userId,
            Action = TaskAuditAction.CommentAdded.ToString(),
            CreatedAt = DateTime.UtcNow
        };
        _context.Set<TaskAuditLog>().Add(auditLog);

        await _context.SaveChangesAsync(cancellationToken);

        var user = await _context.Users.FindAsync(userId);

        return new TaskCommentDto
        {
            Id = comment.Id,
            TaskId = comment.TaskId,
            UserId = comment.UserId,
            UserName = $"{user!.FirstName} {user.LastName}",
            UserProfilePictureUrl = user.ProfilePictureUrl,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            IsEdited = comment.IsEdited
        };
    }

    public async Task<TaskCommentDto> UpdateCommentAsync(int commentId, UpdateTaskCommentDto dto, string userId, CancellationToken cancellationToken = default)
    {
        var comment = await _context.Set<TaskComment>()
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

        if (comment == null)
            throw new TaskCommentNotFoundException(commentId);

        if (comment.UserId != userId)
            throw new UnauthorizedAccessException("You can only edit your own comments");

        comment.Content = dto.Content;
        comment.UpdatedAt = DateTime.UtcNow;
        comment.IsEdited = true;

        await _context.SaveChangesAsync(cancellationToken);

        return new TaskCommentDto
        {
            Id = comment.Id,
            TaskId = comment.TaskId,
            UserId = comment.UserId,
            UserName = $"{comment.User.FirstName} {comment.User.LastName}",
            UserProfilePictureUrl = comment.User.ProfilePictureUrl,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt,
            IsEdited = comment.IsEdited
        };
    }

    public async Task DeleteCommentAsync(int commentId, string userId, CancellationToken cancellationToken = default)
    {
        var comment = await _context.Set<TaskComment>().FindAsync([commentId], cancellationToken);

        if (comment == null)
            throw new TaskCommentNotFoundException(commentId);

        if (comment.UserId != userId)
            throw new UnauthorizedAccessException("You can only delete your own comments");

        _context.Set<TaskComment>().Remove(comment);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<TaskCommentDto>> GetCommentsByTaskIdAsync(int taskId, CancellationToken cancellationToken = default)
    {
        var taskExists = await _context.Set<ProjectTask>().AnyAsync(t => t.Id == taskId, cancellationToken);
        if (!taskExists)
            throw new TaskNotFoundException(taskId);

        var comments = await _context.Set<TaskComment>()
            .Include(c => c.User)
            .Where(c => c.TaskId == taskId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        return comments.Select(c => new TaskCommentDto
        {
            Id = c.Id,
            TaskId = c.TaskId,
            UserId = c.UserId,
            UserName = $"{c.User.FirstName} {c.User.LastName}",
            UserProfilePictureUrl = c.User.ProfilePictureUrl,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            IsEdited = c.IsEdited
        });
    }

    public async Task<TaskAttachmentDto> AddAttachmentAsync(int taskId, string fileName, string fileUrl, long fileSize, string contentType, string uploadedByUserId, CancellationToken cancellationToken = default)
    {
        var taskExists = await _context.Set<ProjectTask>().AnyAsync(t => t.Id == taskId, cancellationToken);
        if (!taskExists)
            throw new TaskNotFoundException(taskId);

        var attachment = new TaskAttachment
        {
            TaskId = taskId,
            FileName = fileName,
            FileUrl = fileUrl,
            FileSize = fileSize,
            ContentType = contentType,
            UploadedByUserId = uploadedByUserId,
            UploadedAt = DateTime.UtcNow
        };

        _context.Set<TaskAttachment>().Add(attachment);

        var auditLog = new TaskAuditLog
        {
            TaskId = taskId,
            UserId = uploadedByUserId,
            Action = TaskAuditAction.AttachmentAdded.ToString(),
            NewValue = fileName,
            CreatedAt = DateTime.UtcNow
        };
        _context.Set<TaskAuditLog>().Add(auditLog);

        await _context.SaveChangesAsync(cancellationToken);

        var user = await _context.Users.FindAsync(uploadedByUserId);

        return new TaskAttachmentDto
        {
            Id = attachment.Id,
            TaskId = attachment.TaskId,
            FileName = attachment.FileName,
            FileUrl = attachment.FileUrl,
            FileSize = attachment.FileSize,
            ContentType = attachment.ContentType,
            UploadedByUserId = attachment.UploadedByUserId,
            UploadedByUserName = $"{user!.FirstName} {user.LastName}",
            UploadedAt = attachment.UploadedAt
        };
    }

    public async Task DeleteAttachmentAsync(int attachmentId, string userId, CancellationToken cancellationToken = default)
    {
        var attachment = await _context.Set<TaskAttachment>().FindAsync([attachmentId], cancellationToken);

        if (attachment == null)
            throw new TaskAttachmentNotFoundException(attachmentId);

        _context.Set<TaskAttachment>().Remove(attachment);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task AddWatcherAsync(int taskId, string userId, CancellationToken cancellationToken = default)
    {
        var taskExists = await _context.Set<ProjectTask>().AnyAsync(t => t.Id == taskId, cancellationToken);
        if (!taskExists)
            throw new TaskNotFoundException(taskId);

        var exists = await _context.Set<TaskWatcher>()
            .AnyAsync(w => w.TaskId == taskId && w.UserId == userId, cancellationToken);

        if (exists)
            return;

        var watcher = new TaskWatcher
        {
            TaskId = taskId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<TaskWatcher>().Add(watcher);

        var auditLog = new TaskAuditLog
        {
            TaskId = taskId,
            UserId = userId,
            Action = TaskAuditAction.WatcherAdded.ToString(),
            CreatedAt = DateTime.UtcNow
        };
        _context.Set<TaskAuditLog>().Add(auditLog);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveWatcherAsync(int taskId, string userId, CancellationToken cancellationToken = default)
    {
        var watcher = await _context.Set<TaskWatcher>()
            .FirstOrDefaultAsync(w => w.TaskId == taskId && w.UserId == userId, cancellationToken);

        if (watcher == null)
            return;

        _context.Set<TaskWatcher>().Remove(watcher);

        var auditLog = new TaskAuditLog
        {
            TaskId = taskId,
            UserId = userId,
            Action = TaskAuditAction.WatcherRemoved.ToString(),
            CreatedAt = DateTime.UtcNow
        };
        _context.Set<TaskAuditLog>().Add(auditLog);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<TaskLabelDto> CreateLabelAsync(CreateTaskLabelDto dto, CancellationToken cancellationToken = default)
    {
        var exists = await _context.ProjectTaskLabels
            .AnyAsync(l => l.Name == dto.Name && l.ProjectId == dto.ProjectId, cancellationToken);

        if (exists)
            throw new ValidationException($"Label with name '{dto.Name}' already exists for this project");

        var label = new ProjectTaskLabel
        {
            Name = dto.Name,
            Color = dto.Color,
            ProjectId = dto.ProjectId,
            CreatedAt = DateTime.UtcNow
        };

        _context.ProjectTaskLabels.Add(label);
        await _context.SaveChangesAsync(cancellationToken);

        return new TaskLabelDto
        {
            Id = label.Id,
            Name = label.Name,
            Color = label.Color,
            ProjectId = label.ProjectId,
            CreatedAt = label.CreatedAt
        };
    }

    public async Task<IEnumerable<TaskLabelDto>> GetLabelsByProjectIdAsync(int? projectId, CancellationToken cancellationToken = default)
    {
        var labels = await _context.ProjectTaskLabels
            .Where(l => l.ProjectId == projectId || l.ProjectId == null)
            .ToListAsync(cancellationToken);

        return labels.Select(l => new TaskLabelDto
        {
            Id = l.Id,
            Name = l.Name,
            Color = l.Color,
            ProjectId = l.ProjectId,
            CreatedAt = l.CreatedAt
        });
    }

    public async Task DeleteLabelAsync(int labelId, CancellationToken cancellationToken = default)
    {
        var label = await _context.ProjectTaskLabels.FindAsync([labelId], cancellationToken);

        if (label == null)
            throw new TaskLabelNotFoundException(labelId);

        _context.ProjectTaskLabels.Remove(label);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<TaskStatusDto>> GetStatusesByProjectIdAsync(int projectId, CancellationToken cancellationToken = default)
    {
        var statuses = await _context.Set<ProjectTaskStatusEntity>()
            .Where(s => s.ProjectId == projectId || s.ProjectId == null)
            .OrderBy(s => s.Order)
            .ToListAsync(cancellationToken);

        return statuses.Select(s => new TaskStatusDto
        {
            Id = s.Id,
            Name = s.Name,
            Color = s.Color,
            Order = s.Order,
            IsDefault = s.IsDefault,
            IsCompleted = s.IsCompleted,
            CreatedAt = s.CreatedAt
        });
    }

    public async Task<IEnumerable<TaskAuditLogDto>> GetAuditLogsByTaskIdAsync(int taskId, CancellationToken cancellationToken = default)
    {
        var logs = await _context.Set<TaskAuditLog>()
            .Include(al => al.User)
            .Where(al => al.TaskId == taskId)
            .OrderByDescending(al => al.CreatedAt)
            .ToListAsync(cancellationToken);

        return logs.Select(al => new TaskAuditLogDto
        {
            Id = al.Id,
            TaskId = al.TaskId,
            UserId = al.UserId,
            UserName = $"{al.User.FirstName} {al.User.LastName}",
            Action = al.Action,
            FieldName = al.FieldName,
            OldValue = al.OldValue,
            NewValue = al.NewValue,
            CreatedAt = al.CreatedAt
        });
    }

    public async Task<TaskDto> CreateTaskAsync(
        CreateTaskDto dto, 
        string createdByUserId,
        List<FileUploadInfo>? attachments = null,
        CancellationToken cancellationToken = default)
    {
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == dto.ProjectId, cancellationToken);
        if (!projectExists)
            throw new ProjectNotFoundException(dto.ProjectId);

        var statusExists = await _context.Set<ProjectTaskStatusEntity>().AnyAsync(s => s.Id == dto.StatusId, cancellationToken);
        if (!statusExists)
            throw new ValidationException("Invalid status ID");

        if (dto.AssignedToUserId != null)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.AssignedToUserId, cancellationToken);
            if (!userExists)
                throw new ValidationException("Assigned user not found");
        }

        if (dto.ParentTaskId.HasValue)
        {
            var parentExists = await _context.Set<ProjectTask>().AnyAsync(t => t.Id == dto.ParentTaskId.Value, cancellationToken);
            if (!parentExists)
                throw new TaskNotFoundException(dto.ParentTaskId.Value);
        }

        if (dto.LabelIds.Length > 0)
        {
            var existingLabelIds = await _context.ProjectTaskLabels
                .Where(l => dto.LabelIds.Contains(l.Id))
                .Select(l => l.Id)
                .ToListAsync(cancellationToken);

            if (existingLabelIds.Count != dto.LabelIds.Length)
            {
                var invalidIds = dto.LabelIds.Except(existingLabelIds);
                throw new ValidationException($"Invalid label IDs: {string.Join(", ", invalidIds)}");
            }
        }

        var uploadedS3Keys = new List<string>();
        
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // 1. Create task
            var task = new ProjectTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                Deadline = dto.Deadline?.ToUniversalTime(),
                IsMilestone = dto.IsMilestone,
                AssignedToUserId = dto.AssignedToUserId,
                ProjectId = dto.ProjectId,
                CreatedByUserId = createdByUserId,
                ParentTaskId = dto.ParentTaskId,
                StatusId = dto.StatusId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Set<ProjectTask>().Add(task);
            await _context.SaveChangesAsync(cancellationToken);

            // 2. Upload attachments to S3
            if (attachments != null && attachments.Count > 0)
            {
                foreach (var attachment in attachments)
                {
                    if (attachment.FileSize == 0)
                        continue;

                    try
                    {
                        // Upload to S3: projects/{projectId}/tasks/{taskId}/{GUID}_{fileName}
                        var fileKey = await _fileStorageService.UploadTaskFileAsync(
                            attachment.FileStream,
                            attachment.FileName,
                            attachment.ContentType,
                            dto.ProjectId,
                            task.Id,
                            cancellationToken);

                        uploadedS3Keys.Add(fileKey);

                        // Create TaskAttachment record
                        var taskAttachment = new TaskAttachment
                        {
                            TaskId = task.Id,
                            FileName = attachment.FileName,
                            FileUrl = fileKey,
                            FileSize = attachment.FileSize,
                            ContentType = attachment.ContentType,
                            UploadedByUserId = createdByUserId,
                            UploadedAt = DateTime.UtcNow
                        };

                        _context.Set<TaskAttachment>().Add(taskAttachment);

                        // Audit log for attachment
                        var attachmentAuditLog = new TaskAuditLog
                        {
                            TaskId = task.Id,
                            UserId = createdByUserId,
                            Action = TaskAuditAction.AttachmentAdded.ToString(),
                            NewValue = attachment.FileName,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.Set<TaskAuditLog>().Add(attachmentAuditLog);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to upload attachment {FileName} for task", attachment.FileName);
                        throw;
                    }
                }
            }

            // 3. Add labels
            if (dto.LabelIds.Length > 0)
            {
                var taskLabels = dto.LabelIds.Select(labelId => new TaskLabel
                {
                    TaskId = task.Id,
                    LabelId = labelId,
                    CreatedAt = DateTime.UtcNow
                }).ToList();

                _context.TaskLabels.AddRange(taskLabels);
            }

            // 4. Add watcher
            var watcher = new TaskWatcher
            {
                TaskId = task.Id,
                UserId = createdByUserId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Set<TaskWatcher>().Add(watcher);

            // 5. Add audit log
            var auditLog = new TaskAuditLog
            {
                TaskId = task.Id,
                UserId = createdByUserId,
                Action = TaskAuditAction.Created.ToString(),
                CreatedAt = DateTime.UtcNow
            };
            _context.Set<TaskAuditLog>().Add(auditLog);

            await _context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return await MapToTaskDtoAsync(task.Id, cancellationToken);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            
            _logger.LogError(ex, "Error creating task '{Title}' for project {ProjectId}. Rolling back transaction and cleaning up uploaded files.", 
                dto.Title, dto.ProjectId);

            // Cleanup: Delete all uploaded files from S3
            if (uploadedS3Keys.Count > 0)
            {
                _logger.LogWarning("Cleaning up {FileCount} uploaded files from S3", uploadedS3Keys.Count);
                
                foreach (var s3Key in uploadedS3Keys)
                {
                    try
                    {
                        await _fileStorageService.DeleteFileAsync(s3Key, cancellationToken);
                    }
                    catch (Exception deleteEx)
                    {
                        _logger.LogError(deleteEx, "Failed to delete file from S3: {S3Key}. Manual cleanup may be required.", s3Key);
                    }
                }
            }

            throw;
        }
    }

    private TaskDto MapToTaskDto(ProjectTask task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            Deadline = task.Deadline,
            StartedAt = task.StartedAt,
            CompletedAt = task.CompletedAt,
            IsMilestone = task.IsMilestone,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUserName = task.AssignedToUser != null ? $"{task.AssignedToUser.FirstName} {task.AssignedToUser.LastName}" : null,
            ProjectId = task.ProjectId,
            ProjectName = task.Project.Name,
            CreatedByUserId = task.CreatedByUserId,
            CreatedByUserName = $"{task.CreatedByUser.FirstName} {task.CreatedByUser.LastName}",
            ParentTaskId = task.ParentTaskId,
            StatusId = task.StatusId,
            StatusName = task.Status.Name,
            StatusColor = task.Status.Color,
            CommentsCount = task.Comments.Count,
            FilesCount = task.Attachments.Count,
            WatchersCount = task.Watchers.Count,
            Labels = task.TaskLabels.Select(tl => tl.Label.Name).ToArray()
        };
    }

    private async Task<TaskDto> MapToTaskDtoAsync(int taskId, CancellationToken cancellationToken)
    {
        var task = await _context.Set<ProjectTask>()
            .Include(t => t.AssignedToUser)
            .Include(t => t.Project)
            .Include(t => t.CreatedByUser)
            .Include(t => t.Status)
            .Include(t => t.Comments)
            .Include(t => t.Attachments)
            .Include(t => t.Watchers)
            .Include(t => t.TaskLabels).ThenInclude(tl => tl.Label)
            .FirstAsync(t => t.Id == taskId, cancellationToken);

        return MapToTaskDto(task);
    }
}
