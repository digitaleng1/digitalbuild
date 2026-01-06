namespace DigitalEngineers.Domain.DTOs.ProjectComment;

public class CreateProjectCommentDto
{
    public int ProjectId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? ParentCommentId { get; set; }
    public string[] MentionedUserIds { get; set; } = Array.Empty<string>();
    public int[] ProjectFileIds { get; set; } = Array.Empty<int>();
}
