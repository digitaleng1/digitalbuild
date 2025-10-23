import httpClient from '@/common/helpers/httpClient';
import type { CreateProjectRequest, ProjectDto } from '@/types/project';

class ProjectService {
	async createProject(data: CreateProjectRequest): Promise<ProjectDto> {
		return httpClient.post('/api/projects', data);
	}
}

export default new ProjectService();
