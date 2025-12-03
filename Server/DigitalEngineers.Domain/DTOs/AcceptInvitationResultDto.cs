using DigitalEngineers.Domain.DTOs.Auth;

namespace DigitalEngineers.Domain.DTOs;

public class AcceptInvitationResultDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}
