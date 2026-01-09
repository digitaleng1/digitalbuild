export interface ClientStats {
	totalProjects: number;
	activeProjects: number;
	totalTasks: number;
	completedTasks: number;
	inProgressTasks: number;
	totalSpecialists: number;
}

export interface ClientProfile {
	id: number;
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePictureUrl?: string;

	// Company Info
	companyName?: string;
	industry?: string;
	website?: string;
	companyDescription?: string;

	// Contact Info
	phoneNumber?: string;
	location?: string;

	// Stats
	stats: ClientStats;

	createdAt: string;
}

export interface UpdateClientProfile {
	firstName: string;
	lastName: string;
	companyName?: string;
	industry?: string;
	website?: string;
	companyDescription?: string;
	phoneNumber?: string;
	location?: string;
}

export interface ClientListItem {
	userId: string;
	name: string;
	email: string;
	companyName?: string;
	profilePictureUrl?: string;
}
