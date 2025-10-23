namespace DigitalEngineers.Domain.DTOs;

public class LicenseTypeDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int ProfessionId { get; init; }
}
