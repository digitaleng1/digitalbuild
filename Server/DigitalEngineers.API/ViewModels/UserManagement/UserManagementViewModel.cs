namespace DigitalEngineers.API.ViewModels.UserManagement;

public class UserManagementViewModel
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public IEnumerable<string> Roles { get; set; } = new List<string>();
    public bool IsActive { get; set; }
    public DateTime? LastActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? LicenseStatus { get; set; }
}
