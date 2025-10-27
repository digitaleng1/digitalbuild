namespace DigitalEngineers.Domain.DTOs;

public class AssignedProjectDto
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Role { get; set; }
    public DateTime AssignedAt { get; set; }
}
