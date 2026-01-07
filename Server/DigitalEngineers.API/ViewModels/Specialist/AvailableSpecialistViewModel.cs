namespace DigitalEngineers.API.ViewModels.Specialist;

public class ProfessionInfoViewModel
{
    public int ProfessionId { get; set; }
    public string ProfessionName { get; set; } = string.Empty;
    public string ProfessionCode { get; set; } = string.Empty;
    public List<LicenseTypeViewModel> LicenseTypes { get; set; } = [];
}

public class AvailableSpecialistViewModel
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Location { get; set; }
    public bool IsAvailableForHire { get; set; }
    public List<LicenseTypeViewModel> LicenseTypes { get; set; } = [];
    public List<ProfessionInfoViewModel> Professions { get; set; } = [];
}
