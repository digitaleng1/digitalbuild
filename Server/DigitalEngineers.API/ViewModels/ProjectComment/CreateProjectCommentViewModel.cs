using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.ProjectComment;

public class CreateProjectCommentViewModel
{
    [Required]
    [StringLength(10000, MinimumLength = 1)]
    public string Content { get; set; } = string.Empty;
    
    public int? ParentCommentId { get; set; }
    
    public string[] MentionedUserIds { get; set; } = [];
    
    public int[] ProjectFileIds { get; set; } = [];
}
