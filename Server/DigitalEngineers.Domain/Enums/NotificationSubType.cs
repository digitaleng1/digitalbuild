namespace DigitalEngineers.Domain.Enums;

/// <summary>
/// Notification sub-type (action)
/// </summary>
public enum NotificationSubType
{
    // Task & Project actions
    Created = 1,
    Assigned = 2,
    StatusChanged = 3,
    Message = 4,
    Completed = 5,
    DeadlineApproaching = 6,
    
    // Bid actions
    RequestReceived = 7,
    ResponseReceived = 8,
    Accepted = 9,
    Rejected = 10,
    
    // Quote actions
    Submitted = 11,
    
    // System actions
    AccountActivation = 12,
    PasswordReset = 13,
    WelcomeMessage = 14
}
