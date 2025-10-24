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
	files: File[];
	thumbnail: File | null;
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
	files: File[];
	thumbnail: File | null;
}

export interface ProjectDto {
	id: number;
	name: string;
	description: string;
	status: string;
	createdAt: string;
}

export interface ProjectFile {
	id: number;
	fileName: string;
	fileUrl: string;
	fileSize: number;
	contentType: string;
	uploadedAt: string;
}
