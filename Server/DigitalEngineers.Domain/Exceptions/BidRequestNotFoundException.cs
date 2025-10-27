namespace DigitalEngineers.Domain.Exceptions;

public class BidRequestNotFoundException : Exception
{
    public int BidRequestId { get; }

    public BidRequestNotFoundException(int bidRequestId)
        : base($"Bid request with ID {bidRequestId} not found")
    {
        BidRequestId = bidRequestId;
    }
}
