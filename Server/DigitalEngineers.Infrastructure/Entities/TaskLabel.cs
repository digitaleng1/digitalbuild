namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Task label entity - labels/tags for tasks
/// </summary>
public class TaskLabel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Project? Project { get; set; }
    public ICollection<TaskLabelAssignment> TaskAssignments { get; set; } = new List<TaskLabelAssignment>();
}
