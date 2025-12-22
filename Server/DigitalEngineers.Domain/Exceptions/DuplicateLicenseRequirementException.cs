namespace DigitalEngineers.Domain.Exceptions;

public class DuplicateLicenseRequirementException : DomainException
{
    public int ProfessionTypeId { get; }
    public int LicenseTypeId { get; }
    public string? ProfessionTypeName { get; }
    public string? ProfessionTypeCode { get; }
    public string? LicenseTypeName { get; }
    public string? LicenseTypeCode { get; }

    public DuplicateLicenseRequirementException(
        int professionTypeId, 
        int licenseTypeId,
        string? professionTypeName = null,
        string? professionTypeCode = null,
        string? licenseTypeName = null,
        string? licenseTypeCode = null)
        : base(FormatMessage(professionTypeId, licenseTypeId, professionTypeName, professionTypeCode, licenseTypeName, licenseTypeCode))
    {
        ProfessionTypeId = professionTypeId;
        LicenseTypeId = licenseTypeId;
        ProfessionTypeName = professionTypeName;
        ProfessionTypeCode = professionTypeCode;
        LicenseTypeName = licenseTypeName;
        LicenseTypeCode = licenseTypeCode;
    }

    private static string FormatMessage(
        int professionTypeId, 
        int licenseTypeId,
        string? professionTypeName,
        string? professionTypeCode,
        string? licenseTypeName,
        string? licenseTypeCode)
    {
        var licenseDisplay = !string.IsNullOrEmpty(licenseTypeName) && !string.IsNullOrEmpty(licenseTypeCode)
            ? $"'{licenseTypeName}' [{licenseTypeCode}]"
            : $"license type {licenseTypeId}";

        var professionDisplay = !string.IsNullOrEmpty(professionTypeName) && !string.IsNullOrEmpty(professionTypeCode)
            ? $"'{professionTypeName}' [{professionTypeCode}]"
            : $"profession type {professionTypeId}";

        return $"License requirement for {licenseDisplay} already exists in {professionDisplay}";
    }
}
