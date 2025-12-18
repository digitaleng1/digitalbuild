namespace DigitalEngineers.Domain.DTOs;

public class LicenseTypeManagementDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsStateSpecific { get; init; }
    public bool IsApproved { get; init; }
    public string? CreatedByUserId { get; init; }
    public string? CreatedByUserName { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public string? RejectionReason { get; init; }
    public int UsageCount { get; init; }
}
