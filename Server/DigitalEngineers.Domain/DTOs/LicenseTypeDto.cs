namespace DigitalEngineers.Domain.DTOs;

public class LicenseTypeDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsStateSpecific { get; init; }
    public int? ProfessionId { get; init; }
    public string? ProfessionName { get; init; }
}
