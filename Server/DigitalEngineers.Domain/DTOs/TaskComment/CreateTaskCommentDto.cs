namespace DigitalEngineers.Domain.DTOs.TaskComment;

public class CreateTaskCommentDto
{
    public int TaskId { get; set; }
    public string Content { get; set; } = string.Empty;
}
