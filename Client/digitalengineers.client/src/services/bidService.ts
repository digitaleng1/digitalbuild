import httpClient from '@/common/helpers/httpClient';
import type { SpecialistForBid, SendBidDto } from '@/types/bid';

class BidService {
	/**
	 * Get specialists matching project's required license types
	 */
	async getSpecialistsForProject(projectId: number): Promise<SpecialistForBid[]> {
		const data = await httpClient.get<SpecialistForBid[]>(`/api/specialists/projects/${projectId}/available`);
		return data as SpecialistForBid[];
	}

	/**
	 * Send bids to selected specialists
	 */
	async sendBids(bidData: SendBidDto): Promise<void> {
		await httpClient.post('/api/bids/send', bidData);
	}
}

export default new BidService();
