namespace DigitalEngineers.API.ViewModels.Auth;

public class UserViewModel
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public IEnumerable<string> Roles { get; set; } = new List<string>();
}
