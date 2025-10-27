namespace DigitalEngineers.API.ViewModels.Specialist;

public class PortfolioItemViewModel
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? ProjectUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
