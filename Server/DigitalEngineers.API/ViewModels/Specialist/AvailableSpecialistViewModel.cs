namespace DigitalEngineers.API.ViewModels.Specialist;

public class AvailableSpecialistViewModel
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Location { get; set; }
    public bool IsAvailableForHire { get; set; }
    public List<LicenseTypeViewModel> LicenseTypes { get; set; } = [];
}
