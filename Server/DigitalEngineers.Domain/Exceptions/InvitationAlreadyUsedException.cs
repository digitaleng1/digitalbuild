namespace DigitalEngineers.Domain.Exceptions;

public class InvitationAlreadyUsedException : DomainException
{
    public string Token { get; }
    
    public InvitationAlreadyUsedException(string token) 
        : base("This invitation has already been used")
    {
        Token = token;
    }
}
