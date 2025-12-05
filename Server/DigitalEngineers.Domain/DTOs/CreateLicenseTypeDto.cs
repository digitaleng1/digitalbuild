namespace DigitalEngineers.Domain.DTOs;

public class CreateLicenseTypeDto
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int ProfessionId { get; init; }
}
