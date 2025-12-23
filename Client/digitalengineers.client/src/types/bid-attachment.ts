/**
 * Bid Request Attachment Types
 * Synchronized with server BidRequestAttachmentViewModel
 */

export interface BidRequestAttachment {
	id: number;
	bidRequestId: number;
	fileName: string;
	fileSize: number;
	fileType: string;
	downloadUrl: string;
	uploadedAt: string;
	uploadedByUserId: string;
	uploadedByName: string;
	description?: string;
}

/**
 * Upload attachment request
 */
export interface UploadBidRequestAttachmentDto {
	file: File;
	description?: string;
}
