namespace DigitalEngineers.Domain.DTOs;

public class ProfessionInfo
{
    public int ProfessionId { get; init; }
    public string ProfessionName { get; init; } = string.Empty;
    public string ProfessionCode { get; init; } = string.Empty;
    public List<LicenseTypeDto> LicenseTypes { get; init; } = [];
}

public class AvailableSpecialistDto
{
    public string UserId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? ProfilePictureUrl { get; init; }
    public string? Location { get; init; }
    public bool IsAvailableForHire { get; init; }
    public List<LicenseTypeDto> LicenseTypes { get; init; } = [];
    public List<ProfessionInfo> Professions { get; init; } = [];
}
