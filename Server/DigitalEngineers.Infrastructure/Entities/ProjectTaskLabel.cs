namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Project task label entity - labels/tags catalog for tasks
/// </summary>
public class ProjectTaskLabel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Project? Project { get; set; }
    public ICollection<TaskLabel> TaskLabels { get; set; } = new List<TaskLabel>();
}
