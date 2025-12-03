namespace DigitalEngineers.API.ViewModels.Specialist;

public class InviteSpecialistResultViewModel
{
    public int SpecialistId { get; set; }
    public string SpecialistUserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string GeneratedPassword { get; set; } = string.Empty;
    public string InvitationToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
