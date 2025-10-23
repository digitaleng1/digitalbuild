namespace DigitalEngineers.API.ViewModels.Auth;

public class ExternalLoginViewModel
{
    public string Provider { get; set; } = string.Empty;
    public string IdToken { get; set; } = string.Empty;
}
