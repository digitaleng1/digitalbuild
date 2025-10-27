namespace DigitalEngineers.Infrastructure.Entities;

/// <summary>
/// Many-to-Many relationship between Project and Specialist with additional properties
/// </summary>
public class ProjectSpecialist
{
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public int SpecialistId { get; set; }
    public Specialist Specialist { get; set; } = null!;
    
    // Additional properties
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public string? Role { get; set; } // e.g., "Lead", "Member", "Consultant"
}
