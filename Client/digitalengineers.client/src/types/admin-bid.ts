export interface AdminBidListItem {
    projectId: number;
    projectName: string;
    projectStatus: 'New' | 'Draft' | 'Published' | 'InProgress' | 'Completed' | 'Cancelled';
    projectBudget: number;
    startDate: string | null;
    pendingBidsCount: number;
    respondedBidsCount: number;
}

export interface AdminBidFilters {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}
