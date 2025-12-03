namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: Email is not confirmed
/// </summary>
public class EmailNotConfirmedException : DomainException
{
    public string Email { get; }
    
    public EmailNotConfirmedException(string email) 
        : base($"Email '{email}' is not confirmed. Please check your inbox and confirm your email.")
    {
        Email = email;
    }
}
