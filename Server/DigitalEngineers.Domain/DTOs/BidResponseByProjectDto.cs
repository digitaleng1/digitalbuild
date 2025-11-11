namespace DigitalEngineers.Domain.DTOs;

public class BidResponseByProjectDto
{
    // Response info
    public int Id { get; set; }
    public int BidRequestId { get; set; }
    public int SpecialistId { get; set; }
    public string SpecialistName { get; set; } = string.Empty;
    public string SpecialistEmail { get; set; } = string.Empty;
    public string? SpecialistProfilePicture { get; set; }
    public int YearsOfExperience { get; set; }
    public double SpecialistRating { get; set; }
    public int LicenseTypeId { get; set; }
    public string LicenseTypeName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal ProposedPrice { get; set; }
    public int EstimatedDays { get; set; }
    public bool IsAvailable { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    
    // Project info
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string? ProjectThumbnailUrl { get; set; }
    public decimal? ProjectBudget { get; set; }
    public DateTime? ProjectDeadline { get; set; }
    
    // Client info
    public string ClientName { get; set; } = string.Empty;
    public string? ClientProfilePictureUrl { get; set; }
}
