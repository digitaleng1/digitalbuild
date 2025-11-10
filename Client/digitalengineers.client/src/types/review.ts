export interface Review {
	id: number;
	projectId: number;
	projectName: string;
	clientName: string;
	clientAvatar?: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface CreateReview {
	projectId: number;
	specialistId: number;
	rating: number;
	comment: string;
}
