namespace DigitalEngineers.Domain.DTOs.TaskLabel;

public class TaskLabelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }
}
