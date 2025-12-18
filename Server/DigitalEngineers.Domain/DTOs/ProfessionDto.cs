namespace DigitalEngineers.Domain.DTOs;

public class ProfessionDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int ProfessionTypesCount { get; init; }
}
