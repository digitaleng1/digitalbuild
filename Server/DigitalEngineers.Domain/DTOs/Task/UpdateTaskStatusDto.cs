namespace DigitalEngineers.Domain.DTOs.Task;

public class UpdateTaskStatusDto
{
    public string Name { get; init; } = string.Empty;
    public string Color { get; init; } = string.Empty;
    public bool IsCompleted { get; init; }
}
