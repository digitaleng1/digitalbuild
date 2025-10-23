export interface ProjectFormData {
	// Step 1
	name: string;
	licenseTypeIds: number[];

	// Step 2
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: '1-3' | 'less-6' | 'greater-6';

	// Step 3
	description: string;
	documentUrls: string[];
}

export interface CreateProjectRequest {
	name: string;
	licenseTypeIds: number[];
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: string;
	description: string;
	documentUrls: string[];
}

export interface ProjectDto {
	id: number;
	name: string;
	description: string;
	status: string;
	createdAt: string;
}
