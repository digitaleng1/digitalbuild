namespace DigitalEngineers.API.ViewModels.TaskLabel;

public class TaskLabelViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }
}
