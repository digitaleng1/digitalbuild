// Quote-related types

export interface AcceptedBidSummaryDto {
	bidResponseId: number;
	specialistName: string;
	role: string;
	proposedPrice: number;
	adminMarkupPercentage: number;
	finalPrice: number;
}

export interface ProjectQuoteDto {
	projectId: number;
	projectName: string;
	acceptedBids: AcceptedBidSummaryDto[];
	suggestedAmount: number;
	quotedAmount: number | null;
	quoteNotes: string | null;
	quoteSubmittedAt: string | null;
}

export interface CreateQuoteRequest {
	quotedAmount: number;
	quoteNotes?: string;
}

export interface RejectQuoteRequest {
	rejectionReason?: string;
}
