import httpClient from '@/common/helpers/httpClient';
import type { 
	SendBidDto, 
	BidRequestDto, 
	BidRequestDetailsDto, 
	CreateBidResponseDto, 
	AcceptBidResponseDto,
	BidMessageDto
} from '@/types/bid';
import type { AdminBidListItem, BidResponseDto as BidResponseByProjectDto } from '@/types/admin-bid';

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

	async sendBidRequest(data: SendBidRequestDto): Promise<void> {
		await httpClient.post('/api/bids/send', data);
	}

	async getBidResponsesByProjectId(projectId: number): Promise<BidResponseByProjectDto[]> {
		return await httpClient.get<BidResponseByProjectDto[]>(`/api/bids/projects/${projectId}/responses`);
	}

	/**
	 * Accept bid response with markup and comment (Admin only)
	 */
	async acceptBidResponse(id: number, data: AcceptBidResponseDto): Promise<void> {
		await httpClient.post(`/api/bids/responses/${id}/accept`, data);
	}

	/**
	 * Reject bid response with reason (Admin only)
	 */
	async rejectBidResponse(id: number, reason: string): Promise<void> {
		await httpClient.post(`/api/bids/responses/${id}/reject`, { reason });
	}

	/**
	 * Send a message to specialist regarding a bid
	 */
	async sendMessage(bidRequestId: number, messageText: string): Promise<BidMessageDto> {
		const data = await httpClient.post<BidMessageDto>('/api/bids/messages', {
			bidRequestId,
			messageText
		});
		return data as BidMessageDto;
	}

	/**
	 * Get all messages for a bid request
	 */
	async getMessages(bidRequestId: number): Promise<BidMessageDto[]> {
		const data = await httpClient.get<BidMessageDto[]>(`/api/bids/requests/${bidRequestId}/messages`);
		return data as BidMessageDto[];
	}
}

export default new BidService();
