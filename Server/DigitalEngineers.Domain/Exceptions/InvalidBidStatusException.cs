using DigitalEngineers.Domain.Enums;

namespace DigitalEngineers.Domain.Exceptions;

public class InvalidBidStatusException : Exception
{
    public string CurrentStatus { get; }
    public string AttemptedStatus { get; }

    public InvalidBidStatusException(BidRequestStatus currentStatus, BidRequestStatus attemptedStatus)
        : base($"Cannot change bid request status from {currentStatus} to {attemptedStatus}")
    {
        CurrentStatus = currentStatus.ToString();
        AttemptedStatus = attemptedStatus.ToString();
    }

    public InvalidBidStatusException(BidResponseStatus currentStatus, BidResponseStatus attemptedStatus)
        : base($"Cannot change bid response status from {currentStatus} to {attemptedStatus}")
    {
        CurrentStatus = currentStatus.ToString();
        AttemptedStatus = attemptedStatus.ToString();
    }
}
