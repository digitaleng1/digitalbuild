namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception thrown when project status doesn't allow quote operation
/// </summary>
public class InvalidProjectStatusForQuoteException : Exception
{
    public int ProjectId { get; }
    public string CurrentStatus { get; }
    
    public InvalidProjectStatusForQuoteException(int projectId, string currentStatus, string operation) 
        : base($"Cannot {operation} for project {projectId}: Current status is {currentStatus}")
    {
        ProjectId = projectId;
        CurrentStatus = currentStatus;
    }
}
