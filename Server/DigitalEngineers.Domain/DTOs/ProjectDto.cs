using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.DTOs;

public class CreateProjectDto
{
    public string Name { get; init; } = string.Empty;
    public int[] LicenseTypeIds { get; init; } = [];
    public string StreetAddress { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string State { get; init; } = string.Empty;
    public string ZipCode { get; init; } = string.Empty;
    public int ProjectScope { get; init; }
    public ProjectManagementType ManagementType { get; init; } = ProjectManagementType.DigitalEngineersManaged;
    public string Description { get; init; } = string.Empty;
}

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public int ProjectScope { get; set; }
    public string ManagementType { get; set; } = string.Empty;
    public int[] LicenseTypeIds { get; set; } = [];
}

public class ProjectDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public int ProjectScope { get; set; }
    public string ManagementType { get; set; } = string.Empty;
    public int[] LicenseTypeIds { get; set; } = [];
    public LicenseTypeDto[] LicenseTypes { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? ThumbnailUrl { get; set; }
    public ProjectFileDto[] Files { get; set; } = [];
}
