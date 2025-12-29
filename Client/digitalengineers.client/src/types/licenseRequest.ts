export enum LicenseRequestStatus {
	Pending = 'Pending',
	Approved = 'Approved',
	Rejected = 'Rejected',
}

export interface CreateLicenseRequest {
	licenseTypeId: number;
	state: string;
	issuingAuthority: string;
	issueDate: string;
	expirationDate: string;
	licenseNumber: string;
	file: File;
}

export interface ResubmitLicenseRequest {
	state: string;
	issuingAuthority: string;
	issueDate: string;
	expirationDate: string;
	licenseNumber: string;
	file?: File;
}

export interface LicenseRequest {
	id: number;
	specialistId: number;
	specialistName: string;
	specialistEmail: string;
	licenseTypeId: number;
	licenseTypeName: string;
	state: string;
	issuingAuthority: string;
	issueDate: string;
	expirationDate: string;
	licenseNumber: string;
	licenseFileUrl?: string;
	status: LicenseRequestStatus;
	adminComment?: string;
	reviewedBy?: string;
	reviewedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ReviewLicenseRequest {
	specialistId: number;
	licenseTypeId: number;
	adminComment?: string;
}
