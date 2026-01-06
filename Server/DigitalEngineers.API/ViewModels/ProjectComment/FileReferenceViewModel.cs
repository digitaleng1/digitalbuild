namespace DigitalEngineers.API.ViewModels.ProjectComment;

/// <summary>
/// View model for file reference in a comment
/// </summary>
public class FileReferenceViewModel
{
    public int Id { get; set; }
    public int ProjectFileId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
}
