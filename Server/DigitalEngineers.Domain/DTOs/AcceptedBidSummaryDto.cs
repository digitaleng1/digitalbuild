namespace DigitalEngineers.Domain.DTOs;

public class AcceptedBidSummaryDto
{
    public int BidResponseId { get; set; }
    public string SpecialistName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public decimal ProposedPrice { get; set; }
    public decimal AdminMarkupPercentage { get; set; }
    public decimal FinalPrice { get; set; }
}
