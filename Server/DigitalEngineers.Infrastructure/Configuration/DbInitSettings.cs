namespace DigitalEngineers.Infrastructure.Configuration;

/// <summary>
/// Database initialization settings from appsettings.json
/// Production: minimal essential data
/// Development: full test data
/// </summary>
public class DbInitSettings
{
    /// <summary>
    /// Roles to seed
    /// Production: [SuperAdmin, Admin, Client, Provider]
    /// Development: [SuperAdmin, Admin, Client, Provider]
    /// </summary>
    public List<string> Roles { get; set; } = new();
    
    /// <summary>
    /// Users to seed (admin + test users)
    /// Production: [1 SuperAdmin]
    /// Development: [SuperAdmin, Admin]
    /// </summary>
    public List<UserConfig> Users { get; set; } = new();
    
    /// <summary>
    /// Test clients to seed
    /// Production: []
    /// Development: [9 clients]
    /// </summary>
    public List<ClientConfig> Clients { get; set; } = new();
    
    /// <summary>
    /// Test providers to seed
    /// Production: []
    /// Development: [9 providers]
    /// </summary>
    public List<ProviderConfig> Providers { get; set; } = new();
    
    /// <summary>
    /// Test projects to seed
    /// Production: []
    /// Development: [10 projects]
    /// </summary>
    public List<ProjectConfig> Projects { get; set; } = new();
    
    /// <summary>
    /// CSI Trade Categories data (Professions, ProfessionTypes, LicenseTypes, LicenseRequirements)
    /// </summary>
    public CsiTradeSettings CsiTrade { get; set; } = new();
}

public class UserConfig
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Biography { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
}

public class ClientConfig
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Biography { get; set; }
    public string? Location { get; set; }
    public string Role { get; set; } = "Client";
}

public class ProviderConfig
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Biography { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    public string Role { get; set; } = "Provider";
    public List<string> LicenseTypeNames { get; set; } = new();
}

public class ProjectConfig
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string ProjectScope { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<string> LicenseTypeNames { get; set; } = new();
    public int CreatedDaysAgo { get; set; }
    public string? ThumbnailUrl { get; set; }
}

/// <summary>
/// CSI Trade Categories configuration
/// </summary>
public class CsiTradeSettings
{
    /// <summary>
    /// Profession categories (e.g., Engineering, Architecture, Electrical Trades)
    /// </summary>
    public List<CsiProfessionConfig> Professions { get; set; } = new();
    
    /// <summary>
    /// License types (e.g., PE, RA, ME)
    /// </summary>
    public List<CsiLicenseTypeConfig> LicenseTypes { get; set; } = new();
    
    /// <summary>
    /// Profession types/subcategories (e.g., Structural Engineering, Civil Engineering)
    /// </summary>
    public List<CsiProfessionTypeConfig> ProfessionTypes { get; set; } = new();
    
    /// <summary>
    /// License requirements mapping profession types to license types
    /// </summary>
    public List<CsiLicenseRequirementConfig> LicenseRequirements { get; set; } = new();
}

/// <summary>
/// CSI Profession configuration (category)
/// </summary>
public class CsiProfessionConfig
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

/// <summary>
/// CSI License Type configuration
/// </summary>
public class CsiLicenseTypeConfig
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsStateSpecific { get; set; }
}

/// <summary>
/// CSI Profession Type configuration (subcategory)
/// </summary>
public class CsiProfessionTypeConfig
{
    public string ProfessionCode { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool RequiresStateLicense { get; set; }
    public int DisplayOrder { get; set; }
}

/// <summary>
/// CSI License Requirement configuration (mapping profession type to license type)
/// </summary>
public class CsiLicenseRequirementConfig
{
    public string ProfessionTypeCode { get; set; } = string.Empty;
    public string LicenseTypeCode { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
}
