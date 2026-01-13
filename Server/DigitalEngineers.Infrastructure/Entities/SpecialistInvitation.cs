using DigitalEngineers.Infrastructure.Entities.Identity;

namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Specialist invitation entity for tracking specialist invitations from bid creation modal
/// </summary>
public class SpecialistInvitation
{
    public int Id { get; set; }
    
    // Invited specialist details
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string GeneratedPassword { get; set; } = string.Empty;
    
    // Invitation token
    public string InvitationToken { get; set; } = string.Empty;
    
    // Custom message from inviter
    public string? CustomMessage { get; set; }
    
    // Profession types for the specialist
    public string ProfessionTypeIds { get; set; } = string.Empty;
    
    // User who sent the invitation
    public string InvitedByUserId { get; set; } = string.Empty;
    public ApplicationUser InvitedByUser { get; set; } = null!;
    
    // Created specialist user
    public string CreatedSpecialistUserId { get; set; } = string.Empty;
    public ApplicationUser CreatedSpecialistUser { get; set; } = null!;
    
    // Invitation status
    public bool IsUsed { get; set; }
    public DateTime? UsedAt { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);
}
