namespace DigitalEngineers.Domain.DTOs;

public class UpdateProfessionTypeDto
{
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool RequiresStateLicense { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; }
}
