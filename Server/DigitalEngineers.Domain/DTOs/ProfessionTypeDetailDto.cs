namespace DigitalEngineers.Domain.DTOs;

public class ProfessionTypeDetailDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int ProfessionId { get; init; }
    public string ProfessionName { get; init; } = string.Empty;
    public string ProfessionCode { get; init; } = string.Empty;
    public bool RequiresStateLicense { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; }
    public bool IsApproved { get; init; }
    public string? CreatedByUserId { get; init; }
    public string? CreatedByUserName { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public string? RejectionReason { get; init; }
    public List<LicenseRequirementDto> LicenseRequirements { get; init; } = [];
}
