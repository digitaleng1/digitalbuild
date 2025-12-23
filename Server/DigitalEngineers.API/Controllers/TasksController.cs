using DigitalEngineers.API.ViewModels.Task;
using DigitalEngineers.API.ViewModels.TaskComment;
using DigitalEngineers.API.ViewModels.TaskLabel;
using DigitalEngineers.API.ViewModels.TaskAuditLog;
using DigitalEngineers.API.ViewModels.TaskAttachment;
using DigitalEngineers.Domain.DTOs;
using DigitalEngineers.Domain.DTOs.Task;
using DigitalEngineers.Domain.DTOs.TaskComment;
using DigitalEngineers.Domain.DTOs.TaskLabel;
using DigitalEngineers.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AutoMapper;

namespace DigitalEngineers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public TasksController(ITaskService taskService, IFileStorageService fileStorageService, IMapper mapper)
    {
        _taskService = taskService;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<TaskViewModel>> CreateTask([FromForm] CreateTaskViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreateTaskDto>(viewModel);
        
        // Parse LabelIdsJson if provided
        if (!string.IsNullOrWhiteSpace(viewModel.LabelIdsJson))
        {
            dto.LabelIds = System.Text.Json.JsonSerializer.Deserialize<int[]>(viewModel.LabelIdsJson) ?? [];
        }
        
        // Convert IFormFile to FileUploadInfo
        List<FileUploadInfo>? attachments = null;
        if (viewModel.Attachments != null && viewModel.Attachments.Count > 0)
        {
            attachments = viewModel.Attachments.Select(f => new FileUploadInfo(
                f.OpenReadStream(),
                f.FileName,
                f.ContentType,
                f.Length
            )).ToList();
        }
        
        var task = await _taskService.CreateTaskAsync(dto, GetUserId(), attachments, cancellationToken);
        var result = _mapper.Map<TaskViewModel>(task);
        
        return CreatedAtAction(nameof(GetTaskById), new { id = result.Id }, result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDetailViewModel>> GetTaskById(int id, CancellationToken cancellationToken)
    {
        var task = await _taskService.GetTaskByIdAsync(id, cancellationToken);
        return Ok(_mapper.Map<TaskDetailViewModel>(task));
    }

    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<TaskViewModel>>> GetTasksByProject(int projectId, CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksByProjectIdAsync(projectId, cancellationToken);
        return Ok(_mapper.Map<IEnumerable<TaskViewModel>>(tasks));
    }

    [HttpGet("assigned")]
    public async Task<ActionResult<IEnumerable<TaskViewModel>>> GetMyTasks(CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksByAssignedUserIdAsync(GetUserId(), cancellationToken);
        return Ok(_mapper.Map<IEnumerable<TaskViewModel>>(tasks));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskViewModel>> UpdateTask(int id, [FromBody] UpdateTaskViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<UpdateTaskDto>(viewModel);
        var task = await _taskService.UpdateTaskAsync(id, dto, GetUserId(), cancellationToken);
        return Ok(_mapper.Map<TaskViewModel>(task));
    }

    [HttpPut("{id}/parent")]
    public async Task<ActionResult<TaskViewModel>> UpdateTaskParent(int id, [FromBody] UpdateTaskParentViewModel viewModel, CancellationToken cancellationToken)
    {
        var task = await _taskService.UpdateTaskParentAsync(id, viewModel.ParentTaskId, GetUserId(), cancellationToken);
        return Ok(_mapper.Map<TaskViewModel>(task));
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<TaskViewModel>> UpdateTaskStatus(int id, [FromBody] UpdateTaskStatusOnlyViewModel viewModel, CancellationToken cancellationToken)
    {
        var task = await _taskService.UpdateTaskStatusAsync(id, viewModel.StatusId, GetUserId(), cancellationToken);
        return Ok(_mapper.Map<TaskViewModel>(task));
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
        var dto = _mapper.Map<CreateTaskCommentDto>(viewModel);
        var comment = await _taskService.AddCommentAsync(dto, GetUserId(), cancellationToken);
        var result = _mapper.Map<TaskCommentViewModel>(comment);
        
        return CreatedAtAction(nameof(GetTaskById), new { id = dto.TaskId }, result);
    }

    [HttpPut("comments/{commentId}")]
    public async Task<ActionResult<TaskCommentViewModel>> UpdateComment(int commentId, [FromBody] UpdateTaskCommentViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<UpdateTaskCommentDto>(viewModel);
        var comment = await _taskService.UpdateCommentAsync(commentId, dto, GetUserId(), cancellationToken);
        return Ok(_mapper.Map<TaskCommentViewModel>(comment));
    }

    [HttpDelete("comments/{commentId}")]
    public async Task<IActionResult> DeleteComment(int commentId, CancellationToken cancellationToken)
    {
        await _taskService.DeleteCommentAsync(commentId, GetUserId(), cancellationToken);
        return NoContent();
    }

    [HttpGet("{taskId}/comments")]
    public async Task<ActionResult<IEnumerable<TaskCommentViewModel>>> GetCommentsByTaskId(int taskId, CancellationToken cancellationToken)
    {
        var comments = await _taskService.GetCommentsByTaskIdAsync(taskId, cancellationToken);
        return Ok(_mapper.Map<IEnumerable<TaskCommentViewModel>>(comments));
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
        var dto = _mapper.Map<CreateTaskLabelDto>(viewModel);
        var label = await _taskService.CreateLabelAsync(dto, cancellationToken);
        var result = _mapper.Map<TaskLabelViewModel>(label);
        
        return CreatedAtAction(nameof(GetLabelsByProject), new { projectId = dto.ProjectId }, result);
    }

    [HttpGet("labels/project/{projectId}")]
    public async Task<ActionResult<IEnumerable<TaskLabelViewModel>>> GetLabelsByProject(int? projectId, CancellationToken cancellationToken)
    {
        var labels = await _taskService.GetLabelsByProjectIdAsync(projectId, cancellationToken);
        return Ok(_mapper.Map<IEnumerable<TaskLabelViewModel>>(labels));
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
        return Ok(_mapper.Map<IEnumerable<TaskAuditLogViewModel>>(logs));
    }

    [HttpGet("statuses/project/{projectId}")]
    public async Task<ActionResult<IEnumerable<TaskStatusViewModel>>> GetStatusesByProject(int projectId, CancellationToken cancellationToken)
    {
        var statuses = await _taskService.GetStatusesByProjectIdAsync(projectId, cancellationToken);
        return Ok(_mapper.Map<IEnumerable<TaskStatusViewModel>>(statuses));
    }

    [HttpPost("statuses")]
    public async Task<ActionResult<TaskStatusViewModel>> CreateStatus([FromBody] CreateTaskStatusViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<CreateTaskStatusDto>(viewModel);
        var status = await _taskService.CreateStatusAsync(dto, cancellationToken);
        var result = _mapper.Map<TaskStatusViewModel>(status);
        
        return CreatedAtAction(nameof(GetStatusesByProject), new { projectId = dto.ProjectId }, result);
    }

    [HttpPut("statuses/{statusId}")]
    public async Task<ActionResult<TaskStatusViewModel>> UpdateStatus(int statusId, [FromBody] UpdateTaskStatusViewModel viewModel, CancellationToken cancellationToken)
    {
        var dto = _mapper.Map<UpdateTaskStatusDto>(viewModel);
        var status = await _taskService.UpdateStatusAsync(statusId, dto, cancellationToken);
        return Ok(_mapper.Map<TaskStatusViewModel>(status));
    }

    [HttpDelete("statuses/{statusId}")]
    public async Task<IActionResult> DeleteStatus(int statusId, CancellationToken cancellationToken)
    {
        await _taskService.DeleteStatusAsync(statusId, cancellationToken);
        return NoContent();
    }

    [HttpPost("statuses/reorder")]
    public async Task<IActionResult> ReorderStatuses([FromBody] ReorderTaskStatusesViewModel viewModel, [FromQuery] int projectId, CancellationToken cancellationToken)
    {
        var dtos = _mapper.Map<IEnumerable<ReorderTaskStatusDto>>(viewModel.Statuses);
        await _taskService.ReorderStatusesAsync(projectId, dtos, cancellationToken);
        return NoContent();
    }

    [HttpGet("{taskId}/files")]
    public async Task<ActionResult<IEnumerable<TaskAttachmentViewModel>>> GetTaskFiles(int taskId, CancellationToken cancellationToken)
    {
        var taskDetail = await _taskService.GetTaskByIdAsync(taskId, cancellationToken);
        
        var files = taskDetail.Attachments.Select(a => new TaskAttachmentViewModel
        {
            Id = a.Id,
            TaskId = a.TaskId,
            FileName = a.FileName,
            FileUrl = _fileStorageService.GetPresignedUrl(a.FileUrl),
            FileSize = a.FileSize,
            ContentType = a.ContentType,
            UploadedByUserId = a.UploadedByUserId,
            UploadedByUserName = a.UploadedByUserName,
            UploadedAt = a.UploadedAt
        });
        
        return Ok(files);
    }

    [HttpPost("{taskId}/files")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<IEnumerable<TaskAttachmentViewModel>>> UploadTaskFiles(
        int taskId,
        [FromForm] List<IFormFile> files,
        CancellationToken cancellationToken)
    {
        if (files == null || files.Count == 0)
            return BadRequest("No files provided");

        var result = new List<TaskAttachmentViewModel>();
        var userId = GetUserId();

        var task = await _taskService.GetTaskByIdAsync(taskId, cancellationToken);
        
        foreach (var file in files)
        {
            if (file.Length == 0)
                continue;

            var fileKey = await _fileStorageService.UploadTaskFileAsync(
                file.OpenReadStream(),
                file.FileName,
                file.ContentType,
                task.ProjectId,
                taskId,
                cancellationToken);

            var attachment = await _taskService.AddAttachmentAsync(
                taskId,
                file.FileName,
                fileKey,
                file.Length,
                file.ContentType,
                userId,
                cancellationToken);

            result.Add(new TaskAttachmentViewModel
            {
                Id = attachment.Id,
                TaskId = attachment.TaskId,
                FileName = attachment.FileName,
                FileUrl = _fileStorageService.GetPresignedUrl(attachment.FileUrl),
                FileSize = attachment.FileSize,
                ContentType = attachment.ContentType,
                UploadedByUserId = attachment.UploadedByUserId,
                UploadedByUserName = attachment.UploadedByUserName,
                UploadedAt = attachment.UploadedAt
            });
        }

        return Ok(result);
    }

    [HttpDelete("files/{fileId}")]
    public async Task<IActionResult> DeleteTaskFile(int fileId, CancellationToken cancellationToken)
    {
        await _taskService.DeleteAttachmentAsync(fileId, GetUserId(), cancellationToken);
        return NoContent();
    }
}
