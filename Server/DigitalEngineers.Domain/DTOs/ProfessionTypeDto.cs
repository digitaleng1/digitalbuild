namespace DigitalEngineers.Domain.DTOs;

public class ProfessionTypeDto
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
    public int LicenseRequirementsCount { get; init; }
}
