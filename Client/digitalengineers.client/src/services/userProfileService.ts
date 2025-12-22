import httpClient from '@/common/helpers/httpClient';
import type { UserProfile, UpdateUserProfile } from '@/types/user-profile';

class UserProfileService {
	async getUserProfile(): Promise<UserProfile> {
		const data = await httpClient.get<UserProfile>('/api/user/profile/me');
		return data as UserProfile;
	}

	async updateUserProfile(data: UpdateUserProfile): Promise<UserProfile> {
		const result = await httpClient.put<UserProfile>('/api/user/profile/me', data);
		return result as UserProfile;
	}

	async uploadAvatar(file: File): Promise<UserProfile> {
		const formData = new FormData();
		formData.append('file', file);

		const result = await httpClient.post<UserProfile>('/api/user/profile/me/avatar', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return result as UserProfile;
	}
}

export default new UserProfileService();
