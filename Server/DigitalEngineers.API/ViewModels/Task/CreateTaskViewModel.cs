using DigitalEngineers.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DigitalEngineers.API.ViewModels.Task;

public class CreateTaskViewModel
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public DateTime? Deadline { get; set; }
    public bool IsMilestone { get; set; }
    
    public string? AssignedToUserId { get; set; }
    public int ProjectId { get; set; }
    public int? ParentTaskId { get; set; }
    public int StatusId { get; set; }
    
    // Serialized as JSON string in multipart form
    public string? LabelIdsJson { get; set; }
    
    // NEW: File attachments
    public List<IFormFile>? Attachments { get; set; }
}
