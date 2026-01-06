using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Project comment entity - project-level communication
/// </summary>
public class ProjectComment
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int? ParentCommentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsEdited { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
    public ProjectComment? ParentComment { get; set; }
    public ICollection<ProjectComment> Replies { get; set; } = [];
    public ICollection<CommentMention> Mentions { get; set; } = [];
    public ICollection<CommentFileReference> FileReferences { get; set; } = [];
}
