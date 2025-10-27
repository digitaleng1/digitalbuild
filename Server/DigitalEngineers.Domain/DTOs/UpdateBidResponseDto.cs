namespace DigitalEngineers.Domain.DTOs;

public class UpdateBidResponseDto
{
    public string? CoverLetter { get; init; }
    public decimal? ProposedPrice { get; init; }
    public int? EstimatedDays { get; init; }
}
