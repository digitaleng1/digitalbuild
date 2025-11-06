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
	licenseTypeIds: number[];

	// Step 2
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: 1 | 2 | 3;

	// Step 3
	description: string;
	files: File[];
	thumbnail: File | null;
}

export interface CreateProjectRequest {
	name: string;
	licenseTypeIds: number[];
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: number;
	description: string;
	files: File[];
	thumbnail: File | null;
}

export interface LicenseType {
	id: number;
	name: string;
	description: string;
	professionId: number;
}

// Synchronized with ProjectViewModel from server
export interface ProjectDto {
	id: number;
	name: string;
	description: string;
	status: string;
	clientId?: string;
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
	createdAt: string;
	updatedAt: string;
	thumbnailUrl?: string;
	files: ProjectFile[];
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
