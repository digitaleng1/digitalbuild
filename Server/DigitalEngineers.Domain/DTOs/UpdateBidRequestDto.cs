using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.DTOs;

public class UpdateBidRequestDto
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public decimal? BudgetMin { get; init; }
    public decimal? BudgetMax { get; init; }
    public DateTime? Deadline { get; init; }
    public BidRequestStatus? Status { get; init; }
}
