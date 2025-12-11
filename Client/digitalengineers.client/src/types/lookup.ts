export interface State {
	value: string;
	label: string;
}

export interface Profession {
	id: number;
	name: string;
	description: string;
}

export interface LicenseType {
	id: number;
	name: string;
	description: string;
	professionId: number;
}

export interface SelectedProfession {
	profession: Profession;
	licenseTypes: LicenseType[];
}

// Client DTOs for creating new profession/license type
export interface CreateProfessionDto {
	name: string;
	description: string;
}

export interface CreateLicenseTypeDto {
	name: string;
	description: string;
	professionId: number;
}

// Response DTOs (for newly created items)
export interface ProfessionViewModel {
	id: number;
	name: string;
	description: string;
	isApproved: boolean;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
}

export interface LicenseTypeViewModel {
	id: number;
	name: string;
	description: string;
	professionId: number;
	isApproved: boolean;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
}

// Admin Management DTOs
export interface ProfessionManagementDto {
	id: number;
	name: string;
	description: string;
	isApproved: boolean;
	createdByUserId?: string;
	createdByName?: string;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
}

export interface LicenseTypeManagementDto {
	id: number;
	name: string;
	description: string;
	professionId: number;
	professionName: string;
	isApproved: boolean;
	createdByUserId?: string;
	createdByName?: string;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
}

// Update DTOs
export interface UpdateProfessionDto {
	name: string;
	description: string;
}

export interface UpdateLicenseTypeDto {
	name: string;
	description: string;
	professionId: number;
}

// Approve DTOs
export interface ApproveProfessionDto {
	isApproved: boolean;
	rejectionReason?: string;
}

export interface ApproveLicenseTypeDto {
	isApproved: boolean;
	rejectionReason?: string;
}

export interface ExportDictionaries {
	professions: ExportProfession[];
	licenseTypes: ExportLicenseType[];
}

export interface ExportProfession {
	id: number;
	name: string;
	description?: string;
	isActive: boolean;
}

export interface ExportLicenseType {
	id: number;
	name: string;
	description?: string;
	professionId: number;
	professionName: string;
	isActive: boolean;
}

export interface ImportDictionaries {
	professions: ImportProfession[];
	licenseTypes: ImportLicenseType[];
}

export interface ImportProfession {
	id?: number;
	name: string;
	description?: string;
	isActive?: boolean;
}

export interface ImportLicenseType {
	id?: number;
	name: string;
	description?: string;
	professionId?: number;
	professionName?: string;
	isActive?: boolean;
}

export interface ImportResult {
	professionsCreated: number;
	professionsUpdated: number;
	licenseTypesCreated: number;
	licenseTypesUpdated: number;
	warnings: string[];
	errors: string[];
	success: boolean;
}
