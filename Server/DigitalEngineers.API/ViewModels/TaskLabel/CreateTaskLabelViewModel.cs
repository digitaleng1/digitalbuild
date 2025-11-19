namespace DigitalEngineers.API.ViewModels.TaskLabel;

public class CreateTaskLabelViewModel
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int? ProjectId { get; set; }
}
