export interface InviteSpecialistDto {
	email: string;
	firstName: string;
	lastName: string;
	customMessage?: string;
	professionTypeIds: number[];
}

export interface InviteSpecialistResult {
	specialistId: number;
	specialistUserId: string;
	email: string;
	fullName: string;
	generatedPassword: string;
	invitationToken: string;
	expiresAt: string;
}

export interface ValidateInvitationResult {
	isValid: boolean;
	email?: string;
	token?: string;
	errorMessage?: string;
}

export interface AcceptInvitationResult {
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
	user: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		roles: string[];
	};
}
