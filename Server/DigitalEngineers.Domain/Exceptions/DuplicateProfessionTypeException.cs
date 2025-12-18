namespace DigitalEngineers.Domain.Exceptions;

public class DuplicateProfessionTypeException : DomainException
{
    public string Name { get; }
    public int ProfessionId { get; }

    public DuplicateProfessionTypeException(string name, int professionId)
        : base($"Profession type '{name}' already exists in profession {professionId}")
    {
        Name = name;
        ProfessionId = professionId;
    }
}
