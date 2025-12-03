namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: Invalid or expired password reset token
/// </summary>
public class InvalidPasswordResetTokenException : DomainException
{
    public InvalidPasswordResetTokenException() 
        : base("Invalid or expired password reset token")
    {
    }
}
