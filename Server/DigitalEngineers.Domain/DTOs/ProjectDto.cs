using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.DTOs;

public record CreateProjectDto(
    string Name,
    int[] LicenseTypeIds,
    string StreetAddress,
    string City,
    string State,
    string ZipCode,
    int ProjectScope,
    string Description,
    string[] DocumentUrls
);

public record ProjectDto(
    int Id,
    string Name,
    string Description,
    string Status,
    DateTime CreatedAt
);

public record ProjectDetailsDto(
    int Id,
    string Name,
    string Description,
    string Status,
    string ClientId,
    string StreetAddress,
    string City,
    string State,
    string ZipCode,
    int ProjectScope,
    string[] DocumentUrls,
    int[] LicenseTypeIds,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string? ThumbnailUrl,
    ProjectFileDto[] Files
);
