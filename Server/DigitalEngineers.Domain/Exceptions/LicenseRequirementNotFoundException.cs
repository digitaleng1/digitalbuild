namespace DigitalEngineers.Domain.Exceptions;

public class LicenseRequirementNotFoundException : NotFoundException
{
    public int? LicenseRequirementId { get; }
    public int? ProfessionTypeId { get; }
    public int? LicenseTypeId { get; }

    public LicenseRequirementNotFoundException(int licenseRequirementId)
        : base($"License requirement with ID {licenseRequirementId} not found")
    {
        LicenseRequirementId = licenseRequirementId;
    }

    public LicenseRequirementNotFoundException(int professionTypeId, int licenseTypeId)
        : base($"License requirement for ProfessionType {professionTypeId} and LicenseType {licenseTypeId} not found")
    {
        ProfessionTypeId = professionTypeId;
        LicenseTypeId = licenseTypeId;
    }
}
