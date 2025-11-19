using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

using User = ApplicationUser;

/// <summary>
/// Task attachment entity - file attachments
/// </summary>
public class TaskAttachment
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string UploadedByUserId { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }

    // Navigation properties
    public ProjectTask Task { get; set; } = null!;
    public User UploadedByUser { get; set; } = null!;
}
