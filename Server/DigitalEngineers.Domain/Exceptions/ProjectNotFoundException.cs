namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception thrown when a project is not found
/// </summary>
public class ProjectNotFoundException : KeyNotFoundException
{
    public int ProjectId { get; }
    
    public ProjectNotFoundException(int projectId) 
        : base($"Project with ID {projectId} not found")
    {
        ProjectId = projectId;
    }
}
