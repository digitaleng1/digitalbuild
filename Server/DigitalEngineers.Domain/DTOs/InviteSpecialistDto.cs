namespace DigitalEngineers.Domain.DTOs;

public class InviteSpecialistDto
{
    public string Email { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? CustomMessage { get; init; }
    public int[] ProfessionTypeIds { get; init; } = [];
}
