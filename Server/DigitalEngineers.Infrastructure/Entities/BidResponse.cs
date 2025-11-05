using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Infrastructure.Entities;

public class BidResponse
{
    public int Id { get; set; }
    
    public int BidRequestId { get; set; }
    public BidRequest BidRequest { get; set; } = null!;
    
    public int SpecialistId { get; set; }
    public Specialist Specialist { get; set; } = null!;
    
    public string CoverLetter { get; set; } = string.Empty;
    public decimal ProposedPrice { get; set; }
    public int EstimatedDays { get; set; }
    
    public string? RejectionReason { get; set; }
    
    public decimal? AdminMarkupPercentage { get; set; }
    public string? AdminComment { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
