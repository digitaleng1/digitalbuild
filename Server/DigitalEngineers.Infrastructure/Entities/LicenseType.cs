using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

public class LicenseType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ProfessionId { get; set; }
    
    // Approval workflow fields
    public bool IsApproved { get; set; } = true;
    public string? CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? RejectionReason { get; set; }
    
    // Navigation properties
    public Profession Profession { get; set; } = null!;
    public ApplicationUser? CreatedBy { get; set; }
}
