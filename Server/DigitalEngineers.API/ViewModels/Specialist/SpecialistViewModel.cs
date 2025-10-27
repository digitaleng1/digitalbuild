namespace DigitalEngineers.API.ViewModels.Specialist;

public class SpecialistViewModel
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public int YearsOfExperience { get; set; }
    public decimal? HourlyRate { get; set; }
    public double Rating { get; set; }
    public bool IsAvailable { get; set; }
    public string? Specialization { get; set; }
    public int[] LicenseTypeIds { get; set; } = [];
}
