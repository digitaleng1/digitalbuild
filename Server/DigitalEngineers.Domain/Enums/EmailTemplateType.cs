namespace DigitalEngineers.Domain.Enums;

/// <summary>
/// Email template types for the system
/// </summary>
public enum EmailTemplateType
{
    // Auth
    WelcomeEmail,
    PasswordReset,
    PasswordChanged,
    AccountActivation,
    SpecialistInvitation,
    AdminWelcome,
    ClientWelcome,
    SpecialistWelcome,
    
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
    TaskDeadlineApproaching,
    
    // License
    LicenseRequestApproved,
    LicenseRequestRejected
}
