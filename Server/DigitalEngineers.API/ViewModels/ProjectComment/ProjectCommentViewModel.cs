namespace DigitalEngineers.API.ViewModels.ProjectComment;

public class ProjectCommentViewModel
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? UserProfilePictureUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? ParentCommentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsEdited { get; set; }
    public int RepliesCount { get; set; }
    public string[] MentionedUserIds { get; set; } = [];
    public string[] MentionedUserNames { get; set; } = [];
    public FileReferenceViewModel[] FileReferences { get; set; } = [];
}
