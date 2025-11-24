using DigitalEngineers.Domain.DTOs.Task;
using DigitalEngineers.Domain.DTOs.TaskComment;
using DigitalEngineers.Domain.DTOs.TaskAttachment;
using DigitalEngineers.Domain.DTOs.TaskWatcher;
using DigitalEngineers.Domain.DTOs.TaskLabel;
using DigitalEngineers.Domain.DTOs.TaskAuditLog;
using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

public interface ITaskService
{
    // Task CRUD
    Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, string createdByUserId, List<FileUploadInfo>? attachments = null, CancellationToken cancellationToken = default);
    Task<TaskDetailDto> GetTaskByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<TaskDto>> GetTasksByProjectIdAsync(int projectId, CancellationToken cancellationToken = default);
    Task<IEnumerable<TaskDto>> GetTasksByAssignedUserIdAsync(string userId, CancellationToken cancellationToken = default);
    Task<TaskDto> UpdateTaskAsync(int id, UpdateTaskDto dto, string updatedByUserId, CancellationToken cancellationToken = default);
    Task DeleteTaskAsync(int id, string deletedByUserId, CancellationToken cancellationToken = default);
    
    // Comments
    Task<TaskCommentDto> AddCommentAsync(CreateTaskCommentDto dto, string userId, CancellationToken cancellationToken = default);
    Task<TaskCommentDto> UpdateCommentAsync(int commentId, UpdateTaskCommentDto dto, string userId, CancellationToken cancellationToken = default);
    Task DeleteCommentAsync(int commentId, string userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<TaskCommentDto>> GetCommentsByTaskIdAsync(int taskId, CancellationToken cancellationToken = default);
    
    // Attachments
    Task<TaskAttachmentDto> AddAttachmentAsync(int taskId, string fileName, string fileUrl, long fileSize, string contentType, string uploadedByUserId, CancellationToken cancellationToken = default);
    Task DeleteAttachmentAsync(int attachmentId, string userId, CancellationToken cancellationToken = default);
    
    // Watchers
    Task AddWatcherAsync(int taskId, string userId, CancellationToken cancellationToken = default);
    Task RemoveWatcherAsync(int taskId, string userId, CancellationToken cancellationToken = default);
    
    // Labels
    Task<TaskLabelDto> CreateLabelAsync(CreateTaskLabelDto dto, CancellationToken cancellationToken = default);
    Task<IEnumerable<TaskLabelDto>> GetLabelsByProjectIdAsync(int? projectId, CancellationToken cancellationToken = default);
    Task DeleteLabelAsync(int labelId, CancellationToken cancellationToken = default);
    
    // Statuses
    Task<IEnumerable<TaskStatusDto>> GetStatusesByProjectIdAsync(int projectId, CancellationToken cancellationToken = default);
    
    // Audit Logs
    Task<IEnumerable<TaskAuditLogDto>> GetAuditLogsByTaskIdAsync(int taskId, CancellationToken cancellationToken = default);
}
