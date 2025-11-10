namespace DigitalEngineers.Domain.DTOs;

public class UpdateSpecialistDto
{
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Biography { get; init; }
    public string? Location { get; init; }
    public string? Website { get; init; }
    public int YearsOfExperience { get; init; }
    public decimal? HourlyRate { get; init; }
    public bool IsAvailable { get; init; }
    public string? Specialization { get; init; }
    public int[] LicenseTypeIds { get; init; } = [];
}
