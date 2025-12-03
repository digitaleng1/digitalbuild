using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Auth;

public class AcceptInvitationViewModel
{
    [Required]
    public string Token { get; init; } = string.Empty;
}
