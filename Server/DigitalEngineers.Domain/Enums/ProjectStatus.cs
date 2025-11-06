namespace DigitalEngineers.Domain.Enums;

public enum ProjectStatus
{
    QuotePending = 0,
    Draft = 1,
    QuoteSubmitted = 2,
    QuoteAccepted = 3,
    QuoteRejected = 4,
    InitialPaymentPending = 5,
    InitialPaymentComplete = 6,
    InProgress = 7,
    Completed = 8,
    Cancelled = 9
}
