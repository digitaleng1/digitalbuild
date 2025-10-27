import httpClient from '@/common/helpers/httpClient';
import type { CreateProjectRequest, ProjectDto, ProjectDetailsDto } from '@/types/project';

class ProjectService {
	/**
	 * Get all projects for current user
	 */
	async getProjects(): Promise<ProjectDto[]> {
		const data = await httpClient.get<ProjectDto[]>('/api/projects');
		return data as ProjectDto[];
	}

	/**
	 * Get project by ID
	 */
	async getProjectById(id: number): Promise<ProjectDetailsDto> {
		const data = await httpClient.get<ProjectDetailsDto>(`/api/projects/${id}`);
		return data as ProjectDetailsDto;
	}

	/**
	 * Create a new project
	 */
	async createProject(data: CreateProjectRequest): Promise<ProjectDto> {
		const formData = new FormData();
		
		// Append text fields
		formData.append('name', data.name);
		formData.append('description', data.description);
		formData.append('streetAddress', data.streetAddress);
		formData.append('city', data.city);
		formData.append('state', data.state);
		formData.append('zipCode', data.zipCode);
		formData.append('projectScope', data.projectScope.toString());
		
		// Append license type IDs
		data.licenseTypeIds.forEach(id => {
			formData.append('licenseTypeIds', id.toString());
		});
		
		// Append files
		if (data.files && data.files.length > 0) {
			data.files.forEach(file => {
				formData.append('files', file);
			});
		}
		
		// Append thumbnail
		if (data.thumbnail) {
			formData.append('thumbnail', data.thumbnail);
		}
		
		const result = await httpClient.post('/api/projects', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		
		return result as ProjectDto;
	}

	/**
	 * Update project status (Admin/SuperAdmin only)
	 */
	async updateProjectStatus(id: number, status: string): Promise<void> {
		await httpClient.patch(`/api/projects/${id}/status`, { status });
	}
}

export default new ProjectService();
