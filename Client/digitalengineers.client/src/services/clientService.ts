import httpClient from '@/common/helpers/httpClient';
import type { ClientProfile, UpdateClientProfile } from '@/types/client';

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
}

export default new ClientService();
