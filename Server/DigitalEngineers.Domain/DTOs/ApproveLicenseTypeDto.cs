namespace DigitalEngineers.Domain.DTOs;

public class ApproveLicenseTypeDto
{
    public bool IsApproved { get; init; }
    public string? RejectionReason { get; init; }
}
