export interface UserProfile {
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePictureUrl?: string;
	phoneNumber?: string;
	location?: string;
	biography?: string;
	website?: string;
	roles: string[];
	createdAt: string;
	lastActive?: string;
}

export interface UpdateUserProfile {
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	location?: string;
	biography?: string;
	website?: string;
}
