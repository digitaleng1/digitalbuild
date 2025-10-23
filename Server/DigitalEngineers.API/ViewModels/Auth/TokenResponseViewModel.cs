namespace DigitalEngineers.API.ViewModels.Auth;

public class TokenResponseViewModel
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserViewModel User { get; set; } = null!;
}
