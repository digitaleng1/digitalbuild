namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: License type not found
/// </summary>
public class LicenseTypeNotFoundException : NotFoundException
{
    public int LicenseTypeId { get; }
    
    public LicenseTypeNotFoundException(int licenseTypeId) 
        : base($"License type with ID {licenseTypeId} not found")
    {
        LicenseTypeId = licenseTypeId;
    }
}
