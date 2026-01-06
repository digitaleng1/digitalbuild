namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Reference to a project file attached to a comment (forward functionality)
/// </summary>
public class CommentFileReference
{
    public int Id { get; set; }
    public int CommentId { get; set; }
    public int ProjectFileId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ProjectComment Comment { get; set; } = null!;
    public ProjectFile ProjectFile { get; set; } = null!;
}
