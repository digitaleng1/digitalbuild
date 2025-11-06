namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception thrown when attempting to submit a quote that has already been submitted
/// </summary>
public class QuoteAlreadySubmittedException : Exception
{
    public int ProjectId { get; }
    
    public QuoteAlreadySubmittedException(int projectId) 
        : base($"Quote for project {projectId} has already been submitted")
    {
        ProjectId = projectId;
    }
}
