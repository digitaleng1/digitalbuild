export interface ProjectFormData {
	// Step 1
	name: string;
	licenseTypeIds: number[];

	// Step 2
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	projectScope: 1 | 2 | 3;

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
	projectScope: number;
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
