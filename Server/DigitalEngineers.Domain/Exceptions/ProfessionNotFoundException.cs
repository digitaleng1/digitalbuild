namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: Profession not found
/// </summary>
public class ProfessionNotFoundException : NotFoundException
{
    public int ProfessionId { get; }
    
    public ProfessionNotFoundException(int professionId) 
        : base($"Profession with ID {professionId} not found")
    {
        ProfessionId = professionId;
    }
}
