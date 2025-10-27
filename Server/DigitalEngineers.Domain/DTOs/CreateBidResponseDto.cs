namespace DigitalEngineers.Domain.DTOs;

public class CreateBidResponseDto
{
    public int BidRequestId { get; init; }
    public int SpecialistId { get; init; }
    public string CoverLetter { get; init; } = string.Empty;
    public decimal ProposedPrice { get; init; }
    public int EstimatedDays { get; init; }
}
