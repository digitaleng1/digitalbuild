namespace DigitalEngineers.Domain.Exceptions;

public class BidRequestAlreadyExistsException : Exception
{
    public int ProjectId { get; }
    public int SpecialistId { get; }
    public string SpecialistName { get; }

    public BidRequestAlreadyExistsException(int projectId, int specialistId, string specialistName)
        : base($"Bid request already exists for specialist '{specialistName}' on this project")
    {
        ProjectId = projectId;
        SpecialistId = specialistId;
        SpecialistName = specialistName;
    }
}
