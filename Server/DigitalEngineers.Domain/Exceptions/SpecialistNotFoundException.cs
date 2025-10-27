namespace DigitalEngineers.Domain.Exceptions;

public class SpecialistNotFoundException : Exception
{
    public int SpecialistId { get; }

    public SpecialistNotFoundException(int specialistId)
        : base($"Specialist with ID {specialistId} not found")
    {
        SpecialistId = specialistId;
    }
}
