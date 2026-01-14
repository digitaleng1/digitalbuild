namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: User not found in the system during login attempt
/// </summary>
public class UserNotFoundException : DomainException
{
    public string Email { get; }
    
    public UserNotFoundException(string email) 
        : base($"User with email '{email}' not found in the system. Please register first or contact support.")
    {
        Email = email;
    }
}
