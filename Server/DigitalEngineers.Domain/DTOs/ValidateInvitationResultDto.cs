namespace DigitalEngineers.Domain.DTOs;

public class ValidateInvitationResultDto
{
    public bool IsValid { get; set; }
    public string? Email { get; set; }
    public string? Token { get; set; }
    public string? ErrorMessage { get; set; }
}
