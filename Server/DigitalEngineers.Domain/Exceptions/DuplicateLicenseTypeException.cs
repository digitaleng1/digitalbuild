namespace DigitalEngineers.Domain.Exceptions;

/// <summary>
/// Exception: Duplicate license type name within profession
/// </summary>
public class DuplicateLicenseTypeException : ValidationException
{
    public string LicenseTypeName { get; }
    public int ProfessionId { get; }
    
    public DuplicateLicenseTypeException(string licenseTypeName, int professionId) 
        : base($"License type '{licenseTypeName}' already exists for this profession")
    {
        LicenseTypeName = licenseTypeName;
        ProfessionId = professionId;
    }
}
