namespace DigitalEngineers.Domain.DTOs;

/// <summary>
/// DTO for client selection in admin interfaces
/// </summary>
public class ClientListDto
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? ProfilePictureUrl { get; set; }
}
