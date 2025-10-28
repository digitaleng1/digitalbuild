import type { LicenseType } from './lookup';

export interface SpecialistForBid {
	userId: string;
	name: string;
	email: string;
	profilePictureUrl?: string;
	licenseTypes: LicenseType[];
	location?: string;
	isAvailableForHire: boolean;
}

export interface SendBidDto {
	projectId: number;
	specialistUserIds: string[];
	price: number;
	description: string;
}

export interface BidFormData {
	price: string;
	description: string;
}
