namespace DigitalEngineers.Domain.DTOs;

public class CreateProfessionTypeDto
{
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int ProfessionId { get; init; }
    public bool RequiresStateLicense { get; init; }
    public int DisplayOrder { get; init; }
}
