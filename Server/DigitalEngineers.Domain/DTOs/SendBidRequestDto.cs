namespace DigitalEngineers.Domain.DTOs;

public class SendBidRequestDto
{
    public int ProjectId { get; init; }
    public string[] SpecialistUserIds { get; init; } = [];
    public decimal Price { get; init; }
    public string Description { get; init; } = string.Empty;
}
