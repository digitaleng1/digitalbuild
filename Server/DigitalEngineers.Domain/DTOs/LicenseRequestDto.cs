using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.DTOs;

public class CreateLicenseRequestDto
{
    public int LicenseTypeId { get; init; }
    public string State { get; init; } = string.Empty;
    public string IssuingAuthority { get; init; } = string.Empty;
    public DateTime IssueDate { get; init; }
    public DateTime ExpirationDate { get; init; }
    public string LicenseNumber { get; init; } = string.Empty;
    public string LicenseFileUrl { get; init; } = string.Empty;
}

public class ResubmitLicenseRequestDto
{
    public string State { get; init; } = string.Empty;
    public string IssuingAuthority { get; init; } = string.Empty;
    public DateTime IssueDate { get; init; }
    public DateTime ExpirationDate { get; init; }
    public string LicenseNumber { get; init; } = string.Empty;
    public string? LicenseFileUrl { get; init; }
}

public class LicenseRequestDto
{
    public int Id { get; set; }
    public int SpecialistId { get; set; }
    public string SpecialistName { get; set; } = string.Empty;
    public string SpecialistEmail { get; set; } = string.Empty;
    public int LicenseTypeId { get; set; }
    public string LicenseTypeName { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string IssuingAuthority { get; set; } = string.Empty;
    public DateTime IssueDate { get; set; }
    public DateTime ExpirationDate { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string? LicenseFileUrl { get; set; }
    public LicenseRequestStatus Status { get; set; }
    public string? AdminComment { get; set; }
    public string? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ReviewLicenseRequestDto
{
    public int SpecialistId { get; init; }
    public int LicenseTypeId { get; init; }
    public string? AdminComment { get; init; }
}
