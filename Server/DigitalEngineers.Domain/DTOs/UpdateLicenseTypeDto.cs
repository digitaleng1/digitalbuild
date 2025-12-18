namespace DigitalEngineers.Domain.DTOs;

public class UpdateLicenseTypeDto
{
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsStateSpecific { get; init; }
}
