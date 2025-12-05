namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: Duplicate profession name
/// </summary>
public class DuplicateProfessionException : ValidationException
{
    public string ProfessionName { get; }
    
    public DuplicateProfessionException(string professionName) 
        : base($"Profession with name '{professionName}' already exists")
    {
        ProfessionName = professionName;
    }
}
