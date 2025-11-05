using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Infrastructure.Entities;

public class BidRequest
{
    public int Id { get; set; }
    
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public int SpecialistId { get; set; }
    public Specialist Specialist { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public BidRequestStatus Status { get; set; } = BidRequestStatus.Pending;
    
    public decimal ProposedBudget { get; set; }
    public DateTime? Deadline { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public BidResponse? Response { get; set; }
    public ICollection<BidMessage> Messages { get; set; } = [];
}
