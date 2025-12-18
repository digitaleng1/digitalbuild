export interface State {
	value: string;
	label: string;
}

// ================== PROFESSION (Category - Level 1) ==================

export interface Profession {
	id: number;
	name: string;
	code: string;
	description: string;
	professionTypesCount: number;
}

export interface ProfessionManagementDto {
	id: number;
	name: string;
	code: string;
	description: string;
	displayOrder: number;
	isApproved: boolean;
	createdByUserId?: string;
	createdByUserName?: string;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
	professionTypesCount: number;
}

export interface CreateProfessionDto {
	name: string;
	code: string;
	description: string;
	displayOrder?: number;
}

export interface UpdateProfessionDto {
	name: string;
	code: string;
	description: string;
	displayOrder?: number;
}

export interface ApproveProfessionDto {
	isApproved: boolean;
	rejectionReason?: string;
}

// ================== PROFESSION TYPE (Subtype - Level 2) ==================

export interface ProfessionType {
	id: number;
	name: string;
	code: string;
	description: string;
	professionId: number;
	professionName: string;
	professionCode: string;
	requiresStateLicense: boolean;
	displayOrder: number;
	isActive: boolean;
	licenseRequirementsCount: number;
}

export interface ProfessionTypeManagementDto {
	id: number;
	name: string;
	code: string;
	description: string;
	professionId: number;
	professionName: string;
	professionCode: string;
	requiresStateLicense: boolean;
	displayOrder: number;
	isActive: boolean;
	isApproved: boolean;
	createdByUserId?: string;
	createdByUserName?: string;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
	licenseRequirementsCount: number;
}

export interface ProfessionTypeDetailDto extends ProfessionType {
	licenseRequirements: LicenseRequirement[];
}

export interface CreateProfessionTypeDto {
	name: string;
	code: string;
	description: string;
	professionId: number;
	requiresStateLicense: boolean;
	displayOrder?: number;
}

export interface UpdateProfessionTypeDto {
	name: string;
	code: string;
	description: string;
	requiresStateLicense: boolean;
	displayOrder?: number;
	isActive?: boolean;
}

export interface ApproveProfessionTypeDto {
	isApproved: boolean;
	rejectionReason?: string;
}

// ================== LICENSE TYPE (License - Level 3) ==================

export interface LicenseType {
	id: number;
	name: string;
	code: string;
	description: string;
	isStateSpecific: boolean;
}

export interface LicenseTypeManagementDto {
	id: number;
	name: string;
	code: string;
	description: string;
	isStateSpecific: boolean;
	isApproved: boolean;
	createdByUserId?: string;
	createdByUserName?: string;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
	usageCount: number;
}

export interface CreateLicenseTypeDto {
	name: string;
	code: string;
	description: string;
	isStateSpecific: boolean;
}

export interface UpdateLicenseTypeDto {
	name: string;
	code: string;
	description: string;
	isStateSpecific: boolean;
}

export interface ApproveLicenseTypeDto {
	isApproved: boolean;
	rejectionReason?: string;
}

// ================== LICENSE REQUIREMENT (Relation - Level 3) ==================

export interface LicenseRequirement {
	id: number;
	professionTypeId: number;
	licenseTypeId: number;
	licenseTypeName: string;
	licenseTypeCode: string;
	isRequired: boolean;
	isStateSpecific: boolean;
	notes?: string;
}

export interface CreateLicenseRequirementDto {
	professionTypeId: number;
	licenseTypeId: number;
	isRequired: boolean;
	notes?: string;
}

export interface UpdateLicenseRequirementDto {
	isRequired: boolean;
	notes?: string;
}

// ================== IMPORT/EXPORT ==================

export interface ExportDictionaries {
	professions: ExportProfession[];
	professionTypes: ExportProfessionType[];
	licenseTypes: ExportLicenseType[];
	licenseRequirements: ExportLicenseRequirement[];
}

export interface ExportProfession {
	id: number;
	name: string;
	code: string;
	description?: string;
	displayOrder: number;
	isActive: boolean;
}

export interface ExportProfessionType {
	id: number;
	name: string;
	code: string;
	description?: string;
	professionId: number;
	professionCode: string;
	requiresStateLicense: boolean;
	displayOrder: number;
	isActive: boolean;
}

export interface ExportLicenseType {
	id: number;
	name: string;
	code: string;
	description?: string;
	isStateSpecific: boolean;
	isActive: boolean;
}

export interface ExportLicenseRequirement {
	id: number;
	professionTypeId: number;
	professionTypeCode: string;
	licenseTypeId: number;
	licenseTypeCode: string;
	isRequired: boolean;
	notes?: string;
}

export interface ImportDictionaries {
	professions: ImportProfession[];
	professionTypes: ImportProfessionType[];
	licenseTypes: ImportLicenseType[];
	licenseRequirements: ImportLicenseRequirement[];
}

export interface ImportProfession {
	id?: number;
	name: string;
	code: string;
	description?: string;
	displayOrder?: number;
	isActive?: boolean;
}

export interface ImportProfessionType {
	id?: number;
	name: string;
	code: string;
	description?: string;
	professionCode: string;
	professionId?: number;
	requiresStateLicense: boolean;
	displayOrder?: number;
	isActive?: boolean;
}

export interface ImportLicenseType {
	id?: number;
	name: string;
	code: string;
	description?: string;
	isStateSpecific: boolean;
	isActive?: boolean;
}

export interface ImportLicenseRequirement {
	professionTypeCode: string;
	licenseTypeCode: string;
	isRequired: boolean;
	notes?: string;
}

export interface ImportResult {
	professionsCreated: number;
	professionsUpdated: number;
	professionTypesCreated: number;
	professionTypesUpdated: number;
	licenseTypesCreated: number;
	licenseTypesUpdated: number;
	licenseRequirementsCreated: number;
	licenseRequirementsUpdated: number;
	warnings: string[];
	errors: string[];
	success: boolean;
}

// ================== LEGACY TYPES (for backward compatibility) ==================

export interface SelectedProfession {
	profession: Profession;
	licenseTypes: LicenseType[];
}

export interface ProfessionViewModel {
	id: number;
	name: string;
	code: string;
	description: string;
	isApproved: boolean;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
}

export interface LicenseTypeViewModel {
	id: number;
	name: string;
	code: string;
	description: string;
	isStateSpecific: boolean;
	isApproved: boolean;
	createdAt: string;
	updatedAt: string;
	rejectionReason?: string;
}
