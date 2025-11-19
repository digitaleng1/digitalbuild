using DigitalEngineers.API.ViewModels.Task;
using DigitalEngineers.API.ViewModels.TaskComment;
using DigitalEngineers.API.ViewModels.TaskLabel;
using DigitalEngineers.API.ViewModels.TaskAuditLog;
using DigitalEngineers.Domain.DTOs.Task;
using DigitalEngineers.Domain.DTOs.TaskComment;
using DigitalEngineers.Domain.DTOs.TaskLabel;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpPost]
    public async Task<ActionResult<TaskViewModel>> CreateTask([FromBody] CreateTaskViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = new CreateTaskDto
        {
            Title = viewModel.Title,
            Description = viewModel.Description,
            Priority = viewModel.Priority,
            Deadline = viewModel.Deadline,
            IsMilestone = viewModel.IsMilestone,
            AssignedToUserId = viewModel.AssignedToUserId,
            ProjectId = viewModel.ProjectId,
            ParentTaskId = viewModel.ParentTaskId,
            StatusId = viewModel.StatusId,
            LabelIds = viewModel.LabelIds
        };

        var task = await _taskService.CreateTaskAsync(dto, GetUserId(), cancellationToken);
        var result = MapToViewModel(task);
        
        return CreatedAtAction(nameof(GetTaskById), new { id = result.Id }, result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDetailViewModel>> GetTaskById(int id, CancellationToken cancellationToken)
    {
        var task = await _taskService.GetTaskByIdAsync(id, cancellationToken);
        return Ok(MapToDetailViewModel(task));
    }

    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<TaskViewModel>>> GetTasksByProject(int projectId, CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksByProjectIdAsync(projectId, cancellationToken);
        return Ok(tasks.Select(MapToViewModel));
    }

    [HttpGet("assigned")]
    public async Task<ActionResult<IEnumerable<TaskViewModel>>> GetMyTasks(CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksByAssignedUserIdAsync(GetUserId(), cancellationToken);
        return Ok(tasks.Select(MapToViewModel));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskViewModel>> UpdateTask(int id, [FromBody] UpdateTaskViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = new UpdateTaskDto
        {
            Title = viewModel.Title,
            Description = viewModel.Description,
            Priority = viewModel.Priority,
            Deadline = viewModel.Deadline,
            IsMilestone = viewModel.IsMilestone,
            AssignedToUserId = viewModel.AssignedToUserId,
            ParentTaskId = viewModel.ParentTaskId,
            StatusId = viewModel.StatusId,
            LabelIds = viewModel.LabelIds
        };

        var task = await _taskService.UpdateTaskAsync(id, dto, GetUserId(), cancellationToken);
        return Ok(MapToViewModel(task));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id, CancellationToken cancellationToken)
    {
        await _taskService.DeleteTaskAsync(id, GetUserId(), cancellationToken);
        return NoContent();
    }

    [HttpPost("comments")]
    public async Task<ActionResult<TaskCommentViewModel>> AddComment([FromBody] CreateTaskCommentViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = new CreateTaskCommentDto
        {
            TaskId = viewModel.TaskId,
            Content = viewModel.Content
        };

        var comment = await _taskService.AddCommentAsync(dto, GetUserId(), cancellationToken);
        var result = MapToCommentViewModel(comment);
        
        return CreatedAtAction(nameof(GetTaskById), new { id = dto.TaskId }, result);
    }

    [HttpPut("comments/{commentId}")]
    public async Task<ActionResult<TaskCommentViewModel>> UpdateComment(int commentId, [FromBody] UpdateTaskCommentViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = new UpdateTaskCommentDto
        {
            Content = viewModel.Content
        };

        var comment = await _taskService.UpdateCommentAsync(commentId, dto, GetUserId(), cancellationToken);
        return Ok(MapToCommentViewModel(comment));
    }

    [HttpDelete("comments/{commentId}")]
    public async Task<IActionResult> DeleteComment(int commentId, CancellationToken cancellationToken)
    {
        await _taskService.DeleteCommentAsync(commentId, GetUserId(), cancellationToken);
        return NoContent();
    }

    [HttpPost("{taskId}/watchers")]
    public async Task<IActionResult> AddWatcher(int taskId, CancellationToken cancellationToken)
    {
        await _taskService.AddWatcherAsync(taskId, GetUserId(), cancellationToken);
        return NoContent();
    }

    [HttpDelete("{taskId}/watchers")]
    public async Task<IActionResult> RemoveWatcher(int taskId, CancellationToken cancellationToken)
    {
        await _taskService.RemoveWatcherAsync(taskId, GetUserId(), cancellationToken);
        return NoContent();
    }

    [HttpPost("labels")]
    public async Task<ActionResult<TaskLabelViewModel>> CreateLabel([FromBody] CreateTaskLabelViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = new CreateTaskLabelDto
        {
            Name = viewModel.Name,
            Color = viewModel.Color,
            ProjectId = viewModel.ProjectId
        };

        var label = await _taskService.CreateLabelAsync(dto, cancellationToken);
        var result = MapToLabelViewModel(label);
        
        return CreatedAtAction(nameof(GetLabelsByProject), new { projectId = dto.ProjectId }, result);
    }

    [HttpGet("labels/project/{projectId}")]
    public async Task<ActionResult<IEnumerable<TaskLabelViewModel>>> GetLabelsByProject(int? projectId, CancellationToken cancellationToken)
    {
        var labels = await _taskService.GetLabelsByProjectIdAsync(projectId, cancellationToken);
        return Ok(labels.Select(MapToLabelViewModel));
    }

    [HttpDelete("labels/{labelId}")]
    public async Task<IActionResult> DeleteLabel(int labelId, CancellationToken cancellationToken)
    {
        await _taskService.DeleteLabelAsync(labelId, cancellationToken);
        return NoContent();
    }

    [HttpGet("{taskId}/audit-logs")]
    public async Task<ActionResult<IEnumerable<TaskAuditLogViewModel>>> GetAuditLogs(int taskId, CancellationToken cancellationToken)
    {
        var logs = await _taskService.GetAuditLogsByTaskIdAsync(taskId, cancellationToken);
        return Ok(logs.Select(MapToAuditLogViewModel));
    }

    private static TaskViewModel MapToViewModel(TaskDto dto) => new()
    {
        Id = dto.Id,
        Title = dto.Title,
        Description = dto.Description,
        Priority = dto.Priority,
        Deadline = dto.Deadline,
        StartedAt = dto.StartedAt,
        CompletedAt = dto.CompletedAt,
        IsMilestone = dto.IsMilestone,
        CreatedAt = dto.CreatedAt,
        UpdatedAt = dto.UpdatedAt,
        AssignedToUserId = dto.AssignedToUserId,
        AssignedToUserName = dto.AssignedToUserName,
        ProjectId = dto.ProjectId,
        ProjectName = dto.ProjectName,
        CreatedByUserId = dto.CreatedByUserId,
        CreatedByUserName = dto.CreatedByUserName,
        ParentTaskId = dto.ParentTaskId,
        StatusId = dto.StatusId,
        StatusName = dto.StatusName,
        StatusColor = dto.StatusColor,
        CommentsCount = dto.CommentsCount,
        AttachmentsCount = dto.AttachmentsCount,
        WatchersCount = dto.WatchersCount,
        Labels = dto.Labels
    };

    private TaskDetailViewModel MapToDetailViewModel(TaskDetailDto dto) => new()
    {
        Id = dto.Id,
        Title = dto.Title,
        Description = dto.Description,
        Priority = dto.Priority,
        Deadline = dto.Deadline,
        StartedAt = dto.StartedAt,
        CompletedAt = dto.CompletedAt,
        IsMilestone = dto.IsMilestone,
        CreatedAt = dto.CreatedAt,
        UpdatedAt = dto.UpdatedAt,
        AssignedToUserId = dto.AssignedToUserId,
        AssignedToUserName = dto.AssignedToUserName,
        AssignedToUserEmail = dto.AssignedToUserEmail,
        ProjectId = dto.ProjectId,
        ProjectName = dto.ProjectName,
        CreatedByUserId = dto.CreatedByUserId,
        CreatedByUserName = dto.CreatedByUserName,
        ParentTaskId = dto.ParentTaskId,
        ParentTaskTitle = dto.ParentTaskTitle,
        StatusId = dto.StatusId,
        StatusName = dto.StatusName,
        StatusColor = dto.StatusColor,
        Comments = dto.Comments.Select(MapToCommentViewModel).ToArray(),
        Attachments = dto.Attachments.Select(a => new API.ViewModels.TaskAttachment.TaskAttachmentViewModel
        {
            Id = a.Id,
            TaskId = a.TaskId,
            FileName = a.FileName,
            FileUrl = a.FileUrl,
            FileSize = a.FileSize,
            ContentType = a.ContentType,
            UploadedByUserId = a.UploadedByUserId,
            UploadedByUserName = a.UploadedByUserName,
            UploadedAt = a.UploadedAt
        }).ToArray(),
        Watchers = dto.Watchers.Select(w => new API.ViewModels.TaskWatcher.TaskWatcherViewModel
        {
            Id = w.Id,
            TaskId = w.TaskId,
            UserId = w.UserId,
            UserName = w.UserName,
            UserEmail = w.UserEmail,
            UserProfilePictureUrl = w.UserProfilePictureUrl,
            CreatedAt = w.CreatedAt
        }).ToArray(),
        Labels = dto.Labels.Select(MapToLabelViewModel).ToArray(),
        ChildTasks = dto.ChildTasks.Select(MapToViewModel).ToArray(),
        AuditLogs = dto.AuditLogs.Select(MapToAuditLogViewModel).ToArray()
    };

    private static TaskCommentViewModel MapToCommentViewModel(Domain.DTOs.TaskComment.TaskCommentDto dto) => new()
    {
        Id = dto.Id,
        TaskId = dto.TaskId,
        UserId = dto.UserId,
        UserName = dto.UserName,
        UserProfilePictureUrl = dto.UserProfilePictureUrl,
        Content = dto.Content,
        CreatedAt = dto.CreatedAt,
        UpdatedAt = dto.UpdatedAt,
        IsEdited = dto.IsEdited
    };

    private static TaskLabelViewModel MapToLabelViewModel(Domain.DTOs.TaskLabel.TaskLabelDto dto) => new()
    {
        Id = dto.Id,
        Name = dto.Name,
        Color = dto.Color,
        ProjectId = dto.ProjectId,
        CreatedAt = dto.CreatedAt
    };

    private static TaskAuditLogViewModel MapToAuditLogViewModel(Domain.DTOs.TaskAuditLog.TaskAuditLogDto dto) => new()
    {
        Id = dto.Id,
        TaskId = dto.TaskId,
        UserId = dto.UserId,
        UserName = dto.UserName,
        Action = dto.Action,
        FieldName = dto.FieldName,
        OldValue = dto.OldValue,
        NewValue = dto.NewValue,
        CreatedAt = dto.CreatedAt
    };
}
