import httpClient from '@/common/helpers/httpClient';
import type { SendBidDto, BidRequestDto, BidRequestDetailsDto, CreateBidResponseDto, BidResponseDto } from '@/types/bid';
import type { AdminBidListItem } from '@/types/admin-bid';

class BidService {
	/**
	 * Send bids to selected specialists
	 */
	async sendBids(bidData: SendBidDto): Promise<void> {
		await httpClient.post('/api/bids/send', bidData);
	}

	// Provider Methods
	
	/**
	 * Get all bid requests for current provider
	 */
	async getMyBidRequests(): Promise<BidRequestDto[]> {
		const data = await httpClient.get<BidRequestDto[]>('/api/bids/my-requests');
		return data as BidRequestDto[];
	}

	/**
	 * Get bid request details by ID
	 */
	async getBidRequestDetails(id: number): Promise<BidRequestDetailsDto> {
		const data = await httpClient.get<BidRequestDetailsDto>(`/api/bids/requests/${id}`);
		return data as BidRequestDetailsDto;
	}

	/**
	 * Submit bid response
	 */
	async submitBidResponse(response: CreateBidResponseDto): Promise<BidResponseDto> {
		const data = await httpClient.post<BidResponseDto>('/api/bids/responses', response);
		return data as BidResponseDto;
	}

	/**
	 * Get admin bid statistics (Admin only)
	 */
	async getAdminBidStatistics(): Promise<AdminBidListItem[]> {
		const data = await httpClient.get<AdminBidListItem[]>('/api/bids/admin/project-statistics');
		return data as AdminBidListItem[];
	}
}

export default new BidService();
