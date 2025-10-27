namespace DigitalEngineers.Domain.Exceptions;

public class UnauthorizedBidAccessException : Exception
{
    public string UserId { get; }
    public string Resource { get; }

    public UnauthorizedBidAccessException(string userId, string resource)
        : base($"User {userId} is not authorized to access {resource}")
    {
        UserId = userId;
        Resource = resource;
    }
}
