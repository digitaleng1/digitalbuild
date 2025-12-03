namespace DigitalEngineers.Domain.Exceptions;

public class InvitationNotFoundException : NotFoundException
{
    public string Token { get; }
    
    public InvitationNotFoundException(string token) 
        : base($"Invitation with token '{token}' not found")
    {
        Token = token;
    }
}
