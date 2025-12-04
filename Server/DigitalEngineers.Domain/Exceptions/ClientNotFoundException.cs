namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: Client not found
/// </summary>
public class ClientNotFoundException : NotFoundException
{
    public int? ClientId { get; }
    
    public ClientNotFoundException(int clientId) 
        : base($"Client with ID {clientId} not found")
    {
        ClientId = clientId;
    }
    
    public ClientNotFoundException(string message) 
        : base(message)
    {
    }
}
