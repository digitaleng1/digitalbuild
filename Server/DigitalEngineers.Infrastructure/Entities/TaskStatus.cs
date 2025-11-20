namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Project task status entity - dynamic statuses for tasks
/// </summary>
public class ProjectTaskStatus
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public int Order { get; set; }
    public bool IsDefault { get; set; }
    public bool IsCompleted { get; set; }
    public int? ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Project? Project { get; set; }
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
