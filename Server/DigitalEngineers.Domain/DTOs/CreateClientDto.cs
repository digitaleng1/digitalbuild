using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.Domain.DTOs;

public class CreateClientDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }
    
    public string? CompanyName { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? CompanyDescription { get; set; }
}
