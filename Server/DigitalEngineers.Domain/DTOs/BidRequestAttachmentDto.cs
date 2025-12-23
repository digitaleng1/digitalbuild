namespace DigitalEngineers.Domain.DTOs;

public class BidRequestAttachmentDto
{
    public int Id { get; set; }
    public int BidRequestId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string FileType { get; set; } = string.Empty;
    public string DownloadUrl { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
    public string UploadedByUserId { get; set; } = string.Empty;
    public string UploadedByName { get; set; } = string.Empty;
    public string? Description { get; set; }
}
