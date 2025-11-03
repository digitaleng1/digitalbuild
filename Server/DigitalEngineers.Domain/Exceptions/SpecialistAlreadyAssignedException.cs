namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception thrown when attempting to assign a specialist who is already assigned to the project
/// </summary>
public class SpecialistAlreadyAssignedException : Exception
{
    public int SpecialistId { get; }
    public int ProjectId { get; }

    public SpecialistAlreadyAssignedException(int specialistId, int projectId)
        : base($"This specialist is already assigned to this project. Cannot approve duplicate bid.")
    {
        SpecialistId = specialistId;
        ProjectId = projectId;
    }

    public SpecialistAlreadyAssignedException(int specialistId, int projectId, string specialistName, string projectName)
        : base($"Specialist '{specialistName}' is already assigned to project '{projectName}'. Cannot approve duplicate bid.")
    {
        SpecialistId = specialistId;
        ProjectId = projectId;
    }
}
