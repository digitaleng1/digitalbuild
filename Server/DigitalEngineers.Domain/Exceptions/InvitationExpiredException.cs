namespace DigitalEngineers.Domain.Exceptions;

public class InvitationExpiredException : DomainException
{
    public string Token { get; }
    public DateTime ExpiresAt { get; }
    
    public InvitationExpiredException(string token, DateTime expiresAt) 
        : base($"This invitation expired on {expiresAt:yyyy-MM-dd HH:mm}")
    {
        Token = token;
        ExpiresAt = expiresAt;
    }
}
