namespace DigitalEngineers.Domain.DTOs;

public class UpdateProfessionDto
{
    public string Name { get; init; } = string.Empty;
    public string Code { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int DisplayOrder { get; init; }
}
