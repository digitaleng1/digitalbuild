import httpClient from '@/common/helpers/httpClient';
import type { SpecialistForBid } from '@/types/bid';

class SpecialistService {
	/**
	 * Get specialists matching project's required license types
	 */
	async getSpecialistsForProject(projectId: number): Promise<SpecialistForBid[]> {
		const data = await httpClient.get<SpecialistForBid[]>(`/api/specialists/projects/${projectId}/available`);
		return data as SpecialistForBid[];
	}
}

export default new SpecialistService();
