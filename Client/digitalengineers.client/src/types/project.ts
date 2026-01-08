import type { ProfessionType, LicenseRequirement, LicenseType, Profession } from './lookup';

// Re-export LicenseType for backward compatibility
export type { LicenseType } from './lookup';

// Project Status Enum
export enum ProjectStatus {
	QuotePending = 'QuotePending',
	Draft = 'Draft',
	QuoteSubmitted = 'QuoteSubmitted',
	QuoteAccepted = 'QuoteAccepted',
	QuoteRejected = 'QuoteRejected',
	InitialPaymentPending = 'InitialPaymentPending',
	InitialPaymentComplete = 'InitialPaymentComplete',
	InProgress = 'InProgress',
	Completed = 'Completed',
	Cancelled = 'Cancelled'
}

// Project Scope Enum
export enum ProjectScope {
	Small = 1,
	Medium = 2,
	Large = 3
}

// Project Management Type Enum
export enum ProjectManagementType {
	ClientManaged = 'ClientManaged',
	DigitalEngineersManaged = 'DigitalEngineersManaged'
}

export interface ProjectFormData {
	// Step 1
	name: string;
	professionTypeIds: number[]; // NEW: Replace licenseTypeIds
	
	// Deprecated - keep for backward compatibility
	licenseTypeIds?: number[];

	// Step 2
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: 1 | 2 | 3;
	managementType: ProjectManagementType;

	// Step 3
	description: string;
	files: File[];
	thumbnail: File | null;
}

export interface CreateProjectRequest {
	name: string;
	professionTypeIds: number[]; // NEW
	licenseTypeIds?: number[]; // Deprecated
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: number;
	managementType: ProjectManagementType;
	description: string;
	files: File[];
	thumbnail: File | null;
}

// Synchronized with ProjectViewModel from server
export interface ProjectDto {
	id: number;
	name: string;
	description: string;
	status: string;
	clientId?: string;
	clientName?: string;
	clientProfilePictureUrl?: string;
	createdAt: string;
	thumbnailUrl?: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: number;
	managementType: string;
	licenseTypeIds: number[];
	quotedAmount?: number;
	taskCount: number;
}

// Synchronized with ProjectDetailsViewModel from server
export interface ProjectDetailsDto {
	id: number;
	name: string;
	description: string;
	status: string;
	clientId: string;
	clientName: string;
	clientEmail: string;
	clientProfilePictureUrl?: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: number;
	managementType: string;
	licenseTypeIds: number[];
	licenseTypes: LicenseType[];
	professionTypeIds: number[];
	professions: Profession[];
	createdAt: string;
	updatedAt: string;
	thumbnailUrl?: string;
	files: ProjectFile[];
	taskCount: number; // Add taskCount to match ProjectDto
	// Quote fields
	quotedAmount?: number;
	quoteSubmittedAt?: string;
	quoteAcceptedAt?: string;
	quoteRejectedAt?: string;
	quoteNotes?: string;
}

export interface ProjectFile {
	id: number;
	fileName: string;
	fileUrl: string;
	fileSize: number;
	contentType: string;
	uploadedAt: string;
}

export interface SpecialistLicenseInfo {
	licenseTypeId: number;
	licenseTypeName: string;
	professionId: number;
	professionName: string;
}

// Synchronized with ProjectTeamMemberDto from server
// Universal interface for both assigned specialists and pending bids
export interface ProjectSpecialistDto {
	specialistId: number;
	userId: string;
	name: string;
	profilePictureUrl?: string;
	role?: string; // Role/Title from ProjectSpecialist
	isAssigned: boolean; // true = assigned, false = pending bid
	isAnonymized: boolean; // true = hide real data (DE managed), false = show real data
	assignedOrBidSentAt: string;
	licenseTypes: SpecialistLicenseInfo[];
}

// NEW: For displaying selected profession types
export interface SelectedProfessionType {
	professionType: ProfessionType;
	licenseRequirements: LicenseRequirement[];
}
