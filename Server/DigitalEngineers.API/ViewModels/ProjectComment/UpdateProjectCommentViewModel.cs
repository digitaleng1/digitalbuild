using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.ProjectComment;

public class UpdateProjectCommentViewModel
{
    [Required]
    [StringLength(10000, MinimumLength = 1)]
    public string Content { get; set; } = string.Empty;
}
