using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Bid;

public class UploadBidRequestAttachmentViewModel
{
    [Required]
    public int BidRequestId { get; set; }

    [Required]
    public IFormFile File { get; set; } = null!;

    [MaxLength(500)]
    public string? Description { get; set; }
}
