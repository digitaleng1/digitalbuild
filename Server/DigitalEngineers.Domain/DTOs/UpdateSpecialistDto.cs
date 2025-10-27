namespace DigitalEngineers.Domain.DTOs;

public class UpdateSpecialistDto
{
    public int YearsOfExperience { get; init; }
    public decimal? HourlyRate { get; init; }
    public bool IsAvailable { get; init; }
    public string? Specialization { get; init; }
    public int[] LicenseTypeIds { get; init; } = [];
}
