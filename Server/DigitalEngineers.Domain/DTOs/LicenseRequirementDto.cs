namespace DigitalEngineers.Domain.DTOs;

public class LicenseRequirementDto
{
    public int Id { get; init; }
    public int ProfessionTypeId { get; init; }
    public int LicenseTypeId { get; init; }
    public string LicenseTypeName { get; init; } = string.Empty;
    public string LicenseTypeCode { get; init; } = string.Empty;
    public bool IsRequired { get; init; }
    public bool IsStateSpecific { get; init; }
    public string? Notes { get; init; }
}
