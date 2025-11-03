import httpClient from '@/common/helpers/httpClient';
import type { SpecialistForBid } from '@/types/bid';
import type { ProjectDto } from '@/types/project';

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
}

export default new SpecialistService();
