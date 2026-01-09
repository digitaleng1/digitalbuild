import httpClient from '@/common/helpers/httpClient';
import type { CreateProjectRequest, ProjectDto, ProjectDetailsDto, ProjectSpecialistDto, ProjectFile } from '@/types/project';
import type { ProjectCommentViewModel, CreateProjectCommentRequest, UpdateProjectCommentRequest, MentionableUser } from '@/types/project-comment';

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
		
		// Append profession type IDs
		data.professionTypeIds.forEach(id => {
			formData.append('professionTypeIds', id.toString());
		});
		
		// Append license type IDs for backward compatibility
		if (data.licenseTypeIds && data.licenseTypeIds.length > 0) {
			data.licenseTypeIds.forEach(id => {
				formData.append('licenseTypeIds', id.toString());
			});
		}
		
		// For Admin: append clientId
		if (data.clientId) {
			formData.append('clientId', data.clientId);
		}
		
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
	 * Change project client (Admin/SuperAdmin only)
	 */
	async changeProjectClient(projectId: number, clientId: string): Promise<void> {
		await httpClient.patch(`/api/projects/${projectId}/client`, { clientId });
	}

	/**
	 * Update project status (Admin/SuperAdmin or Client for ClientManaged projects)
	 */
	async updateProjectStatus(id: number, status: string): Promise<void> {
		await httpClient.patch(`/api/projects/${id}/status`, { status });
	}

	/**
	 * Update project management type (Admin/SuperAdmin or Client for ClientManaged projects)
	 */
	async updateProjectManagementType(id: number, managementType: string): Promise<void> {
		await httpClient.patch(`/api/projects/${id}/management-type`, { managementType });
	}
	
	// Comments
	
	/**
	 * Get all comments for a project
	 */
	async getProjectComments(projectId: number): Promise<ProjectCommentViewModel[]> {
		const data = await httpClient.get<ProjectCommentViewModel[]>(`/api/projects/${projectId}/comments`);
		return data as ProjectCommentViewModel[];
	}
	
	/**
	 * Add a comment to a project
	 */
	async addProjectComment(projectId: number, data: CreateProjectCommentRequest): Promise<ProjectCommentViewModel> {
		const result = await httpClient.post(`/api/projects/${projectId}/comments`, data);
		return result as ProjectCommentViewModel;
	}
	
	/**
	 * Update a comment
	 */
	async updateProjectComment(commentId: number, data: UpdateProjectCommentRequest): Promise<ProjectCommentViewModel> {
		const result = await httpClient.put(`/api/projects/comments/${commentId}`, data);
		return result as ProjectCommentViewModel;
	}
	
	/**
	 * Delete a comment
	 */
	async deleteProjectComment(commentId: number): Promise<void> {
		await httpClient.delete(`/api/projects/comments/${commentId}`);
	}
	
	/**
	 * Get users that can be mentioned in project comments
	 */
	async getProjectMentionableUsers(projectId: number): Promise<MentionableUser[]> {
		const data = await httpClient.get<MentionableUser[]>(`/api/projects/${projectId}/mentionable-users`);
		return data as MentionableUser[];
	}

	/**
	 * Copy task attachment file to project files
	 */
	async copyTaskFileToProject(projectId: number, taskFileId: number): Promise<ProjectFile> {
		return await httpClient.post<ProjectFile>(
			`/api/projects/${projectId}/copy-task-file/${taskFileId}`,
			{}
		);
	}
}

export default new ProjectService();
