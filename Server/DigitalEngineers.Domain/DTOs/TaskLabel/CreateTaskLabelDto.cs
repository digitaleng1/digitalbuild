namespace DigitalEngineers.Domain.DTOs.TaskLabel;

public class CreateTaskLabelDto
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
}
