using System.ComponentModel.DataAnnotations;

namespace DigitalEngineers.API.ViewModels.Specialist;

public class InviteSpecialistViewModel
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string FirstName { get; init; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; init; } = string.Empty;
    
    [MaxLength(1000)]
    public string? CustomMessage { get; init; }
    
    [Required]
    public int[] ProfessionTypeIds { get; init; } = [];
}
