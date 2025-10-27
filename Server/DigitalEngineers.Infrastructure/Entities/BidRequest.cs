using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Infrastructure.Entities;

public class BidRequest
{
    public int Id { get; set; }
    
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public BidRequestStatus Status { get; set; } = BidRequestStatus.Open;
    
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public DateTime? Deadline { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<BidResponse> Responses { get; set; } = [];
}
