namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Task label assignment entity - many-to-many relationship between tasks and labels
/// </summary>
public class TaskLabelAssignment
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int LabelId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ProjectTask Task { get; set; } = null!;
    public TaskLabel Label { get; set; } = null!;
}
