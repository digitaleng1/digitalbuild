namespace DigitalEngineers.API.ViewModels.Dictionary;

public record ProfessionViewModel
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}
