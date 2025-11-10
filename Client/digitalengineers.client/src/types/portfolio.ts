export interface CreatePortfolioItem {
	title: string;
	description: string;
	projectUrl?: string;
	thumbnail?: File;
}

export interface UpdatePortfolioItem {
	title: string;
	description: string;
	projectUrl?: string;
}
