namespace DigitalEngineers.API.ViewModels.Project;

public class ProjectViewModel
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

public class ProjectDetailsViewModel
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
    public LicenseTypeViewModel[] LicenseTypes { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? ThumbnailUrl { get; set; }
    public ProjectFileViewModel[] Files { get; set; } = [];
}

public class ProjectFileViewModel
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}

public class ProjectSpecialistViewModel
{
    public int SpecialistId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public bool IsAssigned { get; set; } // true = assigned, false = pending bid
    public DateTime AssignedOrBidSentAt { get; set; }
    public SpecialistLicenseInfoViewModel[] LicenseTypes { get; set; } = [];
}

public class SpecialistLicenseInfoViewModel
{
    public int LicenseTypeId { get; set; }
    public string LicenseTypeName { get; set; } = string.Empty;
    public int ProfessionId { get; set; }
    public string ProfessionName { get; set; } = string.Empty;
}
