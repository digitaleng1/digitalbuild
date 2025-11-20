namespace DigitalEngineers.API.ViewModels.Task;

public class TaskStatusViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public int Order { get; set; }
    public bool IsDefault { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
