namespace DigitalEngineers.Domain.DTOs;

public class ApproveProfessionTypeDto
{
    public bool IsApproved { get; init; }
    public string? RejectionReason { get; init; }
}
