namespace DigitalEngineers.Domain.DTOs;

public class CreateBidRequestDto
{
    public int ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal ProposedBudget { get; init; }
    public DateTime? Deadline { get; init; }
}
