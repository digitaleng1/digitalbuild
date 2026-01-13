import type { LicenseType } from './lookup';
import type { BidRequestAttachment, BidResponseAttachment } from './bid-attachment';

export interface ProfessionInfo {
	professionId: number;
	professionName: string;
	professionCode: string;
	licenseTypes: LicenseType[];
}

export interface ProfessionTypeInfo {
	professionTypeId: number;
	professionTypeName: string;
	professionTypeCode: string;
	professionId: number;
	professionName: string;
}

export interface SpecialistForBid {
	userId: string;
	name: string;
	email: string;
	profilePictureUrl?: string;
	licenseTypes: LicenseType[];
	professions: ProfessionInfo[];
	professionTypes: ProfessionTypeInfo[];
	professionTypeIds: number[];
	location?: string;
	isAvailableForHire: boolean;
}

export interface SendBidDto {
	projectId: number;
	specialistUserIds: string[];
	description: string;
}

export interface SendBidResponseDto {
	message: string;
	bidRequestIds: number[];
}

export interface BidFormData {
	description: string;
}

// Provider Bid Types
export enum BidRequestStatus {
	Pending = 'Pending',
	Responded = 'Responded',
	Accepted = 'Accepted',
	Rejected = 'Rejected',
	Withdrawn = 'Withdrawn'
}

// Synchronized with server BidRequestViewModel
export interface BidRequestDto {
	id: number;
	projectId: number;
	projectName: string;
	specialistUserId: string;
	specialistName: string;
	title: string;
	description: string;
	status: BidRequestStatus;
	sentAt: string;
	respondedAt?: string;
	message?: string;
	budgetMin?: number;
	budgetMax?: number;
	deadline?: string;
	hasResponse: boolean;
	createdAt: string;
	updatedAt: string;
	attachments?: BidRequestAttachment[];
}

export interface BidRequestDetailsDto {
	id: number;
	projectId: number;
	projectName: string;
	projectDescription: string;
	projectThumbnailUrl?: string;
	specialistUserId: string;
	specialistName: string;
	title: string;
	description: string;
	status: BidRequestStatus;
	sentAt: string;
	respondedAt?: string;
	message?: string;
	budgetMin?: number;
	budgetMax?: number;
	proposedBudget?: number;
	deadline?: string;
	hasResponse: boolean;
	createdAt: string;
	updatedAt: string;
	clientId: string;
	clientName: string;
	clientEmail: string;
	bidResponse?: BidResponseDto;
	response?: BidResponseDto;
	attachments: BidRequestAttachment[];
}

// Synchronized with server BidResponseDto
export interface BidResponseDto {
	id: number;
	bidRequestId: number;
	specialistId: number;
	specialistName: string;
	specialistProfilePicture?: string;
	specialistRating: number;
	coverLetter: string;
	proposedPrice: number;
	estimatedDays: number;
	adminMarkupPercentage?: number;
	adminComment?: string;
	finalPrice?: number;
	createdAt: string;
	updatedAt: string;
	attachments?: BidResponseAttachment[];
}

// Synchronized with server CreateBidResponseViewModel
export interface CreateBidResponseDto {
	bidRequestId: number;
	coverLetter: string;
	proposedPrice: number;
	estimatedDays: number;
}

// Synchronized with server AcceptBidResponseViewModel
export interface AcceptBidResponseDto {
	adminMarkupPercentage: number;
	adminComment?: string;
}

// Synchronized with server BidMessageDto
export interface BidMessageDto {
	id: number;
	bidRequestId: number;
	senderId: string;
	senderName: string;
	senderProfilePictureUrl?: string;
	messageText: string;
	createdAt: string;
}

// Synchronized with server CreateBidMessageViewModel
export interface CreateBidMessageDto {
	bidRequestId: number;
	messageText: string;
}
