using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace DigitalEngineers.API.ViewModels.License;

public class CreateLicenseRequestViewModel
{
    [Required]
    public int LicenseTypeId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string State { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string IssuingAuthority { get; set; } = string.Empty;
    
    [Required]
    public DateTime IssueDate { get; set; }
    
    [Required]
    public DateTime ExpirationDate { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string LicenseNumber { get; set; } = string.Empty;
    
    [Required]
    public IFormFile File { get; set; } = null!;
}

public class ResubmitLicenseRequestViewModel
{
    [Required]
    [MaxLength(100)]
    public string State { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string IssuingAuthority { get; set; } = string.Empty;
    
    [Required]
    public DateTime IssueDate { get; set; }
    
    [Required]
    public DateTime ExpirationDate { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string LicenseNumber { get; set; } = string.Empty;
    
    public IFormFile? File { get; set; }
}

public class ReviewLicenseRequestViewModel
{
    [Required]
    public int SpecialistId { get; set; }
    
    [Required]
    public int LicenseTypeId { get; set; }
    
    [MaxLength(1000)]
    public string? AdminComment { get; set; }
}

public class LicenseRequestViewModel
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
    public string Status { get; set; } = string.Empty;
    public string? AdminComment { get; set; }
    public string? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
