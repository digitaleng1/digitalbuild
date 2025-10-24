/**
 * Project Scope mapping utilities
 */

export const ProjectScopeLabels = {
	1: '1-3 months',
	2: 'Less than 6 months',
	3: 'Greater than 6 months',
} as const;

/**
 * Get human-readable label for project scope
 */
export function getProjectScopeLabel(scope: number): string {
	return ProjectScopeLabels[scope as keyof typeof ProjectScopeLabels] || 'Unknown';
}

/**
 * Format file size from bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.3 MB")
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 * @param filename - File name with extension
 * @returns Extension in uppercase (e.g., ".ZIP", ".PDF")
 */
export function getFileExtension(filename: string): string {
	const ext = filename.split('.').pop();
	return ext ? `.${ext.toUpperCase()}` : '';
}

/**
 * Get Bootstrap badge variant based on project status
 * @param status - Project status
 * @returns Bootstrap variant
 */
export function getStatusBadgeVariant(status: string): 'success' | 'secondary' | 'warning' | 'danger' {
	switch (status.toLowerCase()) {
		case 'completed':
			return 'success';
		case 'inprogress':
		case 'active':
			return 'secondary';
		case 'draft':
		case 'new':
			return 'warning';
		case 'cancelled':
			return 'danger';
		default:
			return 'secondary';
	}
}
