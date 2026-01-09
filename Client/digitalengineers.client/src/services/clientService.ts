import httpClient from '@/common/helpers/httpClient';
import type { ClientProfile, UpdateClientProfile, ClientListItem } from '@/types/client';

class ClientService {
	/**
	 * Get current client profile
	 */
	async getCurrentClientProfile(): Promise<ClientProfile> {
		const data = await httpClient.get<ClientProfile>('/api/clients/profile/me');
		return data as ClientProfile;
	}

	/**
	 * Update current client profile
	 */
	async updateCurrentClientProfile(data: UpdateClientProfile): Promise<ClientProfile> {
		const result = await httpClient.put<ClientProfile>('/api/clients/profile/me', data);
		return result as ClientProfile;
	}

	/**
	 * Upload profile picture (avatar) for current client
	 */
	async uploadProfilePicture(file: File): Promise<{ profilePictureUrl: string }> {
		const formData = new FormData();
		formData.append('file', file);

		const result = await httpClient.post<{ profilePictureUrl: string }>(
			'/api/clients/profile/me/avatar',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return result as { profilePictureUrl: string };
	}

	/**
	 * Get list of clients for selection (Admin only)
	 */
	async getClientList(search?: string): Promise<ClientListItem[]> {
		const params = new URLSearchParams();
		if (search) {
			params.append('search', search);
		}
		
		const url = params.toString() 
			? `/api/clients/list?${params.toString()}`
			: '/api/clients/list';
		
		const data = await httpClient.get<ClientListItem[]>(url);
		return data as ClientListItem[];
	}
}

export default new ClientService();
