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
    public string? ClientId { get; set; }
    public string? ClientName { get; set; }
    public string? ClientProfilePictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public int ProjectScope { get; set; }
    public string ManagementType { get; set; } = string.Empty;
    public int[] LicenseTypeIds { get; set; } = [];
    
    // Quote field
    public decimal? QuotedAmount { get; set; }
    
    // Task count
    public int TaskCount { get; set; }
}

public class ProjectDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string? ClientProfilePictureUrl { get; set; }
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

    // Quote fields
    public decimal? QuotedAmount { get; set; }
    public DateTime? QuoteSubmittedAt { get; set; }
    public DateTime? QuoteAcceptedAt { get; set; }
    public DateTime? QuoteRejectedAt { get; set; }
    public string? QuoteNotes { get; set; }
}

public class ProjectSpecialistDto
{
    public int SpecialistId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Role { get; set; } // Role/Title from ProjectSpecialist
    public bool IsAssigned { get; set; } // true = assigned, false = pending bid
    public bool IsAnonymized { get; set; } // true = hide real data (DE managed), false = show real data
    public DateTime AssignedOrBidSentAt { get; set; }
    public SpecialistLicenseInfoDto[] LicenseTypes { get; set; } = [];
}

public class SpecialistLicenseInfoDto
{
    public int LicenseTypeId { get; set; }
    public string LicenseTypeName { get; set; } = string.Empty;
    public int ProfessionId { get; set; }
    public string ProfessionName { get; set; } = string.Empty;
}
