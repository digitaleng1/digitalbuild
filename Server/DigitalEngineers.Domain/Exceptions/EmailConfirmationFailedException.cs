namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: Email confirmation failed
/// </summary>
public class EmailConfirmationFailedException : DomainException
{
    public EmailConfirmationFailedException(string message) : base(message) { }
}
