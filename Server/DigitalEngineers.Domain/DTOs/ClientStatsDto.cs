namespace DigitalEngineers.Domain.DTOs;

public class ClientStatsDto
{
    public int TotalProjects { get; set; }
    public int ActiveProjects { get; set; }
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int InProgressTasks { get; set; }
    public int TotalSpecialists { get; set; }
}
