namespace DigitalEngineers.API.ViewModels.Project;

public class ProjectQuoteViewModel
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public AcceptedBidSummaryViewModel[] AcceptedBids { get; set; } = [];
    public decimal SuggestedAmount { get; set; }
    public decimal? QuotedAmount { get; set; }
    public string? QuoteNotes { get; set; }
    public DateTime? QuoteSubmittedAt { get; set; }
}
