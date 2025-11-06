namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception thrown when an invalid project status is provided
/// </summary>
public class InvalidProjectStatusException : ArgumentException
{
    public string InvalidStatus { get; }
    
    public InvalidProjectStatusException(string status) 
        : base($"Invalid project status: '{status}'. Allowed values: QuotePending, Draft, QuoteSubmitted, QuoteAccepted, QuoteRejected, InitialPaymentPending, InitialPaymentComplete, InProgress, Completed, Cancelled")
    {
        InvalidStatus = status;
    }
}
