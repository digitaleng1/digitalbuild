namespace DigitalEngineers.Domain.Exceptions;

public class DuplicateLicenseRequirementException : DomainException
{
    public int ProfessionTypeId { get; }
    public int LicenseTypeId { get; }

    public DuplicateLicenseRequirementException(int professionTypeId, int licenseTypeId)
        : base($"License requirement for license type {licenseTypeId} already exists in profession type {professionTypeId}")
    {
        ProfessionTypeId = professionTypeId;
        LicenseTypeId = licenseTypeId;
    }
}
