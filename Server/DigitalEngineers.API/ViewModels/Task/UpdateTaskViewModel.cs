using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.API.ViewModels.Task;

public class UpdateTaskViewModel
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public DateTime? Deadline { get; set; }
    public bool IsMilestone { get; set; }
    
    public string? AssignedToUserId { get; set; }
    public int? ParentTaskId { get; set; }
    public int StatusId { get; set; }
    
    public int[] LabelIds { get; set; } = [];
}
