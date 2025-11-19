namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Task label entity - many-to-many relationship between tasks and labels
/// </summary>
public class TaskLabel
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int LabelId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ProjectTask Task { get; set; } = null!;
    public ProjectTaskLabel Label { get; set; } = null!;
}
