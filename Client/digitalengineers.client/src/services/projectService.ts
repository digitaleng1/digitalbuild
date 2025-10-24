import httpClient from '@/common/helpers/httpClient';
import type { CreateProjectRequest, ProjectDto } from '@/types/project';

class ProjectService {
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
		
		const response = await httpClient.post('/api/projects', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		
		return response.data;
	}
}

export default new ProjectService();
