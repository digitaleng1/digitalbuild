namespace DigitalEngineers.Domain.DTOs;

public class AvailableSpecialistDto
{
    public string UserId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? ProfilePictureUrl { get; init; }
    public string? Location { get; init; }
    public bool IsAvailableForHire { get; init; }
    public List<LicenseTypeDto> LicenseTypes { get; init; } = [];
}
