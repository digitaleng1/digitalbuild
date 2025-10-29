namespace DigitalEngineers.Domain.Exceptions;

public class SpecialistNotFoundException : Exception
{
    public int SpecialistId { get; }
    public string UserId { get; }

    public SpecialistNotFoundException(int specialistId)
        : base($"Specialist with ID {specialistId} not found")
    {
        SpecialistId = specialistId;
        UserId = string.Empty;
    }

    public SpecialistNotFoundException(string userId)
        : base(userId)
    {
        SpecialistId = 0;
        UserId = userId;
    }
}
