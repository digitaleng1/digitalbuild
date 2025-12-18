namespace DigitalEngineers.Domain.DTOs;

public class CreateLicenseRequirementDto
{
    public int ProfessionTypeId { get; init; }
    public int LicenseTypeId { get; init; }
    public bool IsRequired { get; init; }
    public string? Notes { get; init; }
}
