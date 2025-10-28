namespace DigitalEngineers.Domain.Exceptions;

public class InvalidBidRequestException : ArgumentException
{
    public InvalidBidRequestException(string message) : base(message) { }
}
