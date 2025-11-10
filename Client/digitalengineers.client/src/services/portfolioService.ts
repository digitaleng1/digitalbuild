import httpClient from '@/common/helpers/httpClient';
import type { PortfolioItem } from '@/types/specialist';
import type { CreatePortfolioItem, UpdatePortfolioItem } from '@/types/portfolio';

class PortfolioService {
	/**
	 * Get portfolio items by specialist ID
	 */
	async getPortfolioItems(specialistId: number): Promise<PortfolioItem[]> {
		const data = await httpClient.get<PortfolioItem[]>(`/api/portfolio/specialists/${specialistId}`);
		return data as PortfolioItem[];
	}

	/**
	 * Create portfolio item
	 */
	async createPortfolioItem(specialistId: number, item: CreatePortfolioItem): Promise<PortfolioItem> {
		const formData = new FormData();
		formData.append('title', item.title);
		formData.append('description', item.description);
		
		if (item.projectUrl) {
			formData.append('projectUrl', item.projectUrl);
		}
		
		if (item.thumbnail) {
			formData.append('thumbnail', item.thumbnail);
		}

		const data = await httpClient.post<PortfolioItem>(
			`/api/portfolio/specialists/${specialistId}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return data as PortfolioItem;
	}

	/**
	 * Update portfolio item
	 */
	async updatePortfolioItem(id: number, item: UpdatePortfolioItem): Promise<PortfolioItem> {
		const data = await httpClient.put<PortfolioItem>(`/api/portfolio/${id}`, item);
		return data as PortfolioItem;
	}

	/**
	 * Delete portfolio item
	 */
	async deletePortfolioItem(id: number): Promise<void> {
		await httpClient.delete(`/api/portfolio/${id}`);
	}
}

export default new PortfolioService();
