using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Comment mention entity - tracks user mentions in project comments
/// </summary>
public class CommentMention
{
    public int Id { get; set; }
    public int CommentId { get; set; }
    public string MentionedUserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ProjectComment Comment { get; set; } = null!;
    public ApplicationUser MentionedUser { get; set; } = null!;
}
