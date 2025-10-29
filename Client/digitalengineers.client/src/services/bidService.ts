import httpClient from '@/common/helpers/httpClient';
import type { SpecialistForBid, SendBidDto, BidRequestDto, BidRequestDetailsDto, CreateBidResponseDto, BidResponseDto } from '@/types/bid';

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
}

export default new BidService();
