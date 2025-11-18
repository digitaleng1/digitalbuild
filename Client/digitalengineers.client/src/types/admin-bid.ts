export interface AdminBidListItem {
    projectId: number;
    projectName: string;
    projectStatus: 'New' | 'Draft' | 'Published' | 'InProgress' | 'Completed' | 'Cancelled';
    projectBudget: number;
    startDate: string | null;
    pendingBidsCount: number;
    respondedBidsCount: number;
    acceptedBidsCount: number;
    rejectedBidsCount: number;
}

export interface AdminBidFilters {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface BidResponseDto {
    // Response info
    id: number;
    bidRequestId: number;
    specialistId: number;
    specialistName: string;
    specialistEmail: string;
    specialistProfilePicture: string | null;
    yearsOfExperience: number;
    specialistRating: number;
    licenseTypeId: number;
    licenseTypeName: string;
    status: string;
    proposedPrice: number;
    estimatedDays: number;
    isAvailable: boolean;
    coverLetter: string;
    submittedAt: string;
    
    // Project info
    projectId: number;
    projectName: string;
    projectThumbnailUrl: string | null;
    projectBudget: number | null;
    projectDeadline: string | null;
    
    // Client info
    clientName: string;
    clientProfilePictureUrl: string | null;
}

export interface GroupedBidResponses {
    licenseTypeId: number;
    licenseTypeName: string;
    responses: BidResponseDto[];
}
