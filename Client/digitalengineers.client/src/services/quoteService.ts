import httpClient from '@/common/helpers/httpClient';
import type { ProjectQuoteDto, CreateQuoteRequest, RejectQuoteRequest } from '@/types/quote';

class QuoteService {
	/**
	 * Get project quote data (Admin/SuperAdmin only)
	 */
	async getProjectQuoteData(projectId: number): Promise<ProjectQuoteDto> {
		const data = await httpClient.get<ProjectQuoteDto>(`/api/projects/${projectId}/quote-data`);
		return data as ProjectQuoteDto;
	}

	/**
	 * Submit quote to client (Admin/SuperAdmin only)
	 */
	async submitQuote(projectId: number, data: CreateQuoteRequest): Promise<void> {
		await httpClient.post(`/api/projects/${projectId}/quote/submit`, data);
	}

	/**
	 * Update existing quote (Admin/SuperAdmin only)
	 */
	async updateQuote(projectId: number, data: CreateQuoteRequest): Promise<void> {
		await httpClient.put(`/api/projects/${projectId}/quote`, data);
	}

	/**
	 * Accept quote (Client only)
	 */
	async acceptQuote(projectId: number): Promise<void> {
		await httpClient.post(`/api/projects/${projectId}/quote/accept`, {});
	}

	/**
	 * Reject quote (Client only)
	 */
	async rejectQuote(projectId: number, data?: RejectQuoteRequest): Promise<void> {
		await httpClient.post(`/api/projects/${projectId}/quote/reject`, data || {});
	}
}

export default new QuoteService();
