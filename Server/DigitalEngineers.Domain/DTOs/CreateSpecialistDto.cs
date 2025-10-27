namespace DigitalEngineers.Domain.DTOs;

public class CreateSpecialistDto
{
    public string UserId { get; init; } = string.Empty;
    public int YearsOfExperience { get; init; }
    public decimal? HourlyRate { get; init; }
    public string? Specialization { get; init; }
    public int[] LicenseTypeIds { get; init; } = [];
}
