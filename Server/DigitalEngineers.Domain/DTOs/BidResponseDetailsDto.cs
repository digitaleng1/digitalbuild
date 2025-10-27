namespace DigitalEngineers.Domain.DTOs;

public class BidResponseDetailsDto
{
    public int Id { get; set; }
    public int BidRequestId { get; set; }
    public string BidRequestTitle { get; set; } = string.Empty;
    public int SpecialistId { get; set; }
    public string SpecialistName { get; set; } = string.Empty;
    public string? SpecialistProfilePicture { get; set; }
    public double SpecialistRating { get; set; }
    public int SpecialistYearsOfExperience { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public decimal ProposedPrice { get; set; }
    public int EstimatedDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public BidMessageDto[] Messages { get; set; } = [];
}
