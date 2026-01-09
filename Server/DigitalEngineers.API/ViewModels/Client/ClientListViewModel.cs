namespace DigitalEngineers.API.ViewModels.Client;

/// <summary>
/// ViewModel for client selection dropdown
/// </summary>
public class ClientListViewModel
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? ProfilePictureUrl { get; set; }
}
