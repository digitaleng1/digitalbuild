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
	description: string;
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
