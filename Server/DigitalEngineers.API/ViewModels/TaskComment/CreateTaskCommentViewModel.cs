namespace DigitalEngineers.API.ViewModels.TaskComment;

public class CreateTaskCommentViewModel
{
    public int TaskId { get; set; }
    public string Content { get; set; } = string.Empty;
}
