using DigitalEngineers.API.ViewModels.Task;
using DigitalEngineers.API.ViewModels.TaskComment;
using DigitalEngineers.API.ViewModels.TaskLabel;
using DigitalEngineers.API.ViewModels.TaskAuditLog;
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
    private readonly IMapper _mapper;

    public TasksController(ITaskService taskService, IMapper mapper)
    {
        _taskService = taskService;
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
}
