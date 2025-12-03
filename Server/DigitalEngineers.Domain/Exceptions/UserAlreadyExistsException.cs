namespace DigitalEngineers.Domain.Exceptions;

public class UserAlreadyExistsException : ValidationException
{
    public string Email { get; }
    
    public UserAlreadyExistsException(string email) 
        : base($"User with email '{email}' already exists")
    {
        Email = email;
    }
}
