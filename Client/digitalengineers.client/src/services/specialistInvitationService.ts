import httpClient from '@/common/helpers/httpClient';
import type {
	InviteSpecialistDto,
	InviteSpecialistResult,
	ValidateInvitationResult,
	AcceptInvitationResult,
} from '@/types/specialist-invitation';

class SpecialistInvitationService {
	/**
	 * Invite a new specialist
	 */
	async inviteSpecialist(dto: InviteSpecialistDto): Promise<InviteSpecialistResult> {
		const data = await httpClient.post<InviteSpecialistResult>('/api/specialists/invite', dto);
		return data as InviteSpecialistResult;
	}

	/**
	 * Validate invitation token
	 */
	async validateInvitation(token: string): Promise<ValidateInvitationResult> {
		const data = await httpClient.get<ValidateInvitationResult>(`/api/auth/invite/validate/${token}`);
		return data as ValidateInvitationResult;
	}

	/**
	 * Accept invitation and auto-login
	 */
	async acceptInvitation(token: string): Promise<AcceptInvitationResult> {
		const data = await httpClient.post<AcceptInvitationResult>('/api/auth/invite/accept', { token });
		return data as AcceptInvitationResult;
	}
}

export default new SpecialistInvitationService();
