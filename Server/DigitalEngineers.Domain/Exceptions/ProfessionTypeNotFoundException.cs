namespace DigitalEngineers.Domain.Exceptions;

public class ProfessionTypeNotFoundException : NotFoundException
{
    public int ProfessionTypeId { get; }

    public ProfessionTypeNotFoundException(int professionTypeId)
        : base($"Profession type with ID {professionTypeId} not found")
    {
        ProfessionTypeId = professionTypeId;
    }
}
