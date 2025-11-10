import type { LicenseType } from './project';
import type { ProjectDto } from './project';
import type { Review } from './review';

export interface SpecialistStats {
	completedProjects: number;
	totalReviews: number;
	averageRating: number;
	yearsOfExperience: number;
	hourlyRate?: number;
}

export interface PortfolioItem {
	id: number;
	title: string;
	description: string;
	thumbnailUrl?: string;
	projectUrl?: string;
	createdAt: string;
}

export interface AssignedProject {
	projectId: number;
	projectName: string;
	status: string;
	role?: string;
	assignedAt: string;
}

export interface SpecialistProfile {
	id: number;
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePictureUrl?: string;
	biography?: string;
	location?: string;
	website?: string;
	specialization?: string;
	yearsOfExperience: number;
	hourlyRate?: number;
	rating: number;
	isAvailable: boolean;
	licenseTypeIds: number[];
	licenseTypes: LicenseType[];
	portfolio: PortfolioItem[];
	assignedProjects: AssignedProject[];
	reviews: Review[];
	stats?: SpecialistStats;
	createdAt: string;
	updatedAt: string;
}
