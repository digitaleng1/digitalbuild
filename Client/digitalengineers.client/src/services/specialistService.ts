import httpClient from '@/common/helpers/httpClient';
import type { SpecialistForBid } from '@/types/bid';
import type { ProjectDto } from '@/types/project';
import type { SpecialistProfile, SpecialistStats, UpdateSpecialistDto } from '@/types/specialist';

class SpecialistService {
	/**
	 * Get specialists matching project's required license types
	 */
	async getSpecialistsForProject(projectId: number): Promise<SpecialistForBid[]> {
		const data = await httpClient.get<SpecialistForBid[]>(`/api/specialists/projects/${projectId}/available`);
		return data as SpecialistForBid[];
	}

	/**
	 * Get projects assigned to a specific specialist
	 */
	async getSpecialistProjects(specialistId: number): Promise<ProjectDto[]> {
		const data = await httpClient.get<ProjectDto[]>(`/api/specialists/${specialistId}/projects`);
		return data as ProjectDto[];
	}

	/**
	 * Get current specialist profile (for Provider role)
	 */
	async getCurrentSpecialistProfile(): Promise<SpecialistProfile> {
		const data = await httpClient.get<SpecialistProfile>('/api/specialists/me');
		return data as SpecialistProfile;
	}

	/**
	 * Get specialist statistics
	 */
	async getSpecialistStats(specialistId: number): Promise<SpecialistStats> {
		const data = await httpClient.get<SpecialistStats>(`/api/specialists/${specialistId}/stats`);
		return data as SpecialistStats;
	}

	/**
	 * Update current specialist profile (for Provider role)
	 */
	async updateSpecialist(id: number, data: UpdateSpecialistDto): Promise<SpecialistProfile> {
		const result = await httpClient.put<SpecialistProfile>('/api/specialists/me', data);
		return result as SpecialistProfile;
	}

	/**
	 * Upload profile picture (avatar) for current specialist
	 */
	async uploadProfilePicture(file: File): Promise<SpecialistProfile> {
		const formData = new FormData();
		formData.append('file', file);

		const result = await httpClient.post<SpecialistProfile>('/api/specialists/me/avatar', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return result as SpecialistProfile;
	}
}

export default new SpecialistService();
