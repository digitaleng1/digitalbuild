import httpClient from '@/common/helpers/httpClient';
import type { CreateProjectRequest, ProjectDto, ProjectDetailsDto, ProjectSpecialistDto } from '@/types/project';

class ProjectService {
	/**
	 * Get all projects for current user
	 */
	async getProjects(params?: {
		statuses?: string[];
		dateFrom?: string;
		dateTo?: string;
		search?: string;
	}): Promise<ProjectDto[]> {
		const queryParams = new URLSearchParams();
		
		if (params?.statuses && params.statuses.length > 0) {
			params.statuses.forEach(status => queryParams.append('statuses', status));
		}
		
		if (params?.dateFrom) {
			queryParams.append('dateFrom', params.dateFrom);
		}
		
		if (params?.dateTo) {
			queryParams.append('dateTo', params.dateTo);
		}
		
		if (params?.search) {
			queryParams.append('search', params.search);
		}
		
		const url = queryParams.toString() 
			? `/api/projects?${queryParams.toString()}`
			: '/api/projects';
		
		const data = await httpClient.get<ProjectDto[]>(url);
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
	 * Get project team members (assigned + pending bids)
	 */
	async getProjectTeamMembers(id: number): Promise<ProjectSpecialistDto[]> {
		const data = await httpClient.get<ProjectSpecialistDto[]>(`/api/projects/${id}/team-members`);
		return data as ProjectSpecialistDto[];
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
		formData.append('managementType', data.managementType);
		
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

	/**
	 * Update project management type (Admin/SuperAdmin only)
	 */
	async updateProjectManagementType(id: number, managementType: string): Promise<void> {
		await httpClient.patch(`/api/projects/${id}/management-type`, { managementType });
	}
}

export default new ProjectService();
