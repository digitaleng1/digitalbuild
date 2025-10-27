namespace DigitalEngineers.Domain.DTOs;

public class CreatePortfolioItemDto
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? ProjectUrl { get; init; }
}
