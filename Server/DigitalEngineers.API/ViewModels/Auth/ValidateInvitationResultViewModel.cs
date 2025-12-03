namespace DigitalEngineers.API.ViewModels.Auth;

public class ValidateInvitationResultViewModel
{
    public bool IsValid { get; set; }
    public string? Email { get; set; }
    public string? Token { get; set; }
    public string? ErrorMessage { get; set; }
}
