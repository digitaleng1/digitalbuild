using DigitalEngineers.Domain.DTOs;

namespace DigitalEngineers.Domain.Interfaces;

/// <summary>
/// Service for specialist invitation functionality
/// </summary>
public interface ISpecialistInvitationService
{
    Task<InviteSpecialistResultDto> InviteSpecialistAsync(InviteSpecialistDto dto, string invitedByUserId, CancellationToken cancellationToken = default);
    Task<ValidateInvitationResultDto> ValidateInvitationTokenAsync(string token, CancellationToken cancellationToken = default);
    Task<AcceptInvitationResultDto> AcceptInvitationAsync(string token, CancellationToken cancellationToken = default);
}
