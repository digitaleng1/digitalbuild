export type User = {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	roles: string[];
	specialistId?: number;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: string;
};
