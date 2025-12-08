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
    /// Professions to seed
    /// Production: [2 essential professions]
    /// Development: [10 professions]
    /// </summary>
    public List<ProfessionConfig> Professions { get; set; } = new();
    
    /// <summary>
    /// License types to seed
    /// Production: [1 essential license]
    /// Development: [30 license types]
    /// </summary>
    public List<LicenseTypeConfig> LicenseTypes { get; set; } = new();
    
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

public class ProfessionConfig
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class LicenseTypeConfig
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ProfessionName { get; set; } = string.Empty;
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
