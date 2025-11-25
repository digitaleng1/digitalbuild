namespace DigitalEngineers.Domain.DTOs.Task;

public class CreateTaskStatusDto
{
    public int ProjectId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Color { get; init; } = "#6c757d";
    public int Order { get; init; }
    public bool IsCompleted { get; init; } = false;
}
