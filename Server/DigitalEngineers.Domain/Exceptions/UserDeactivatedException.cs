namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: User account is deactivated
/// </summary>
public class UserDeactivatedException : DomainException
{
    public string Email { get; }
    
    public UserDeactivatedException(string email) 
        : base($"Account '{email}' has been deactivated. Please contact support.")
    {
        Email = email;
    }
}
