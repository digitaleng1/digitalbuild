using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Many-to-Many relationship between Specialist and LicenseType
/// </summary>
public class SpecialistLicenseType
{
    public int SpecialistId { get; set; }
    public Specialist Specialist { get; set; } = null!;
    
    public int LicenseTypeId { get; set; }
    public LicenseType LicenseType { get; set; } = null!;
    
    public int ProfessionTypeId { get; set; }
    public ProfessionType ProfessionType { get; set; } = null!;
    
    public string? State { get; set; }
    public string? IssuingAuthority { get; set; }
    public DateTime? IssueDate { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public string? LicenseNumber { get; set; }
    public string? LicenseFileUrl { get; set; }
    
    // Status and verification fields (replaces SpecialistLicenseRequest)
    public LicenseRequestStatus Status { get; set; } = LicenseRequestStatus.Pending;
    public string? AdminComment { get; set; }
    public bool IsVerified { get; set; } = false;
    public string? VerifiedBy { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
