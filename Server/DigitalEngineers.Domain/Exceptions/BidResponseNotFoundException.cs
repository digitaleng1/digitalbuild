namespace DigitalEngineers.Domain.Exceptions;

public class BidResponseNotFoundException : Exception
{
    public int BidResponseId { get; }

    public BidResponseNotFoundException(int bidResponseId)
        : base($"Bid response with ID {bidResponseId} not found")
    {
        BidResponseId = bidResponseId;
    }
}
