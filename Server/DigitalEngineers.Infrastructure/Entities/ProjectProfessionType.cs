namespace DigitalEngineers.Infrastructure.Entities;

public class ProjectProfessionType
{
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    
    public int ProfessionTypeId { get; set; }
    public ProfessionType ProfessionType { get; set; } = null!;
}
