namespace DigitalEngineers.API.ViewModels.Bid;

public class ProjectBidStatisticsViewModel
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string ProjectStatus { get; set; } = string.Empty;
    public decimal ProjectBudget { get; set; }
    public DateTime? StartDate { get; set; }
    public int PendingBidsCount { get; set; }
    public int RespondedBidsCount { get; set; }
}
