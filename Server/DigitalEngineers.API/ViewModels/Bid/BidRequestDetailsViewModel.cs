namespace DigitalEngineers.API.ViewModels.Bid;

public class BidRequestDetailsViewModel
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string ProjectDescription { get; set; } = string.Empty;
    public string? ProjectThumbnailUrl { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal? ProposedBudget { get; set; }
    public DateTime? Deadline { get; set; }
    public bool HasResponse { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public BidResponseViewModel? Response { get; set; }
    public List<BidRequestAttachmentViewModel> Attachments { get; set; } = new();
}
