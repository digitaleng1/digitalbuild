namespace DigitalEngineers.Domain.DTOs;

public class ProfessionWithTypesDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int DisplayOrder { get; init; }
    public List<ProfessionTypeDto> ProfessionTypes { get; init; } = [];
}
