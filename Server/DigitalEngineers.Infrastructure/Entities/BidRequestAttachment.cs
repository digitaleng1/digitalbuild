using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

public class BidRequestAttachment
{
    public int Id { get; set; }
    
    public int BidRequestId { get; set; }
    public BidRequest BidRequest { get; set; } = null!;
    
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string FileType { get; set; } = string.Empty;
    public string S3Key { get; set; } = string.Empty;
    
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    public string UploadedByUserId { get; set; } = string.Empty;
    public ApplicationUser UploadedByUser { get; set; } = null!;
    
    public string? Description { get; set; }
}
