namespace DigitalEngineers.Domain.Enums;

/// <summary>
/// Email template types for the system
/// </summary>
public enum EmailTemplateType
{
    // Auth
    WelcomeEmail,
    PasswordReset,
    AccountActivation,
    
    // Project
    ProjectCreated,
    ProjectAssigned,
    ProjectStatusChanged,
    
    // Quote
    QuoteSubmitted,
    QuoteAccepted,
    QuoteRejected,
    
    // Bid
    BidRequest,
    BidResponseReceived,
    BidAccepted,
    BidRejected,
    
    // Task
    TaskCreated,
    TaskAssigned,
    TaskCompleted,
    TaskCommentAdded,
    TaskAttachmentAdded,
    TaskDeadlineApproaching
}
