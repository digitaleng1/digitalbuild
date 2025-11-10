namespace DigitalEngineers.Domain.Exceptions;

public class LicenseRequestNotFoundException : NotFoundException
{
    public int LicenseRequestId { get; }
    
    public LicenseRequestNotFoundException(int licenseRequestId) 
        : base($"License request with ID {licenseRequestId} not found")
    {
        LicenseRequestId = licenseRequestId;
    }
}
