namespace DigitalEngineers.Domain.DTOs;

public class BidResponseDto
{
    public int Id { get; set; }
    public int BidRequestId { get; set; }
    public int SpecialistId { get; set; }
    public string SpecialistName { get; set; } = string.Empty;
    public string? SpecialistProfilePicture { get; set; }
    public double SpecialistRating { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public decimal ProposedPrice { get; set; }
    public int EstimatedDays { get; set; }
    public decimal? AdminMarkupPercentage { get; set; }
    public string? AdminComment { get; set; }
    public decimal? FinalPrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<BidResponseAttachmentDto> Attachments { get; set; } = new();
}
