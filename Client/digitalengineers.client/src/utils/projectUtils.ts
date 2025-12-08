import { ProjectStatus, ProjectManagementType } from '@/types/project';
import type { ProjectDto, ProjectDetailsDto } from '@/types/project';

/**
 * Project Status Display Names
 */
export const ProjectStatusLabels: Record<ProjectStatus, string> = {
	[ProjectStatus.QuotePending]: 'Quote Pending',
	[ProjectStatus.Draft]: 'Draft',
	[ProjectStatus.QuoteSubmitted]: 'Quote Submitted',
	[ProjectStatus.QuoteAccepted]: 'Quote Accepted',
	[ProjectStatus.QuoteRejected]: 'Quote Rejected',
	[ProjectStatus.InitialPaymentPending]: 'Initial Payment Pending',
	[ProjectStatus.InitialPaymentComplete]: 'Initial Payment Complete',
	[ProjectStatus.InProgress]: 'In Progress',
	[ProjectStatus.Completed]: 'Completed',
	[ProjectStatus.Cancelled]: 'Cancelled',
};

/**
 * Get human-readable label for project status
 */
export function getProjectStatusLabel(status: string | ProjectStatus): string {
	return ProjectStatusLabels[status as ProjectStatus] || status;
}

/**
 * Project Scope mapping utilities
 */
export const ProjectScopeLabels = {
	1: '1-3 months',
	2: 'Less than 6 months',
	3: 'Greater than 6 months',
} as const;

/**
 * Project Scope Short Labels
 */
export const ProjectScopeShortLabels = {
	1: 'Small',
	2: 'Medium',
	3: 'Large',
} as const;

/**
 * Get human-readable label for project scope
 */
export function getProjectScopeLabel(scope: number): string {
	return ProjectScopeLabels[scope as keyof typeof ProjectScopeLabels] || 'Unknown';
}

/**
 * Get short label for project scope (Small/Medium/Large)
 */
export function getProjectScopeShortLabel(scope: number): string {
	return ProjectScopeShortLabels[scope as keyof typeof ProjectScopeShortLabels] || 'Unknown';
}

/**
 * Get Bootstrap badge variant for project scope
 */
export function getProjectScopeBadgeVariant(scope: number): 'success' | 'warning' | 'danger' {
	switch (scope) {
		case 1:
			return 'success';
		case 2:
			return 'warning';
		case 3:
			return 'danger';
		default:
			return 'warning';
	}
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
export function getStatusBadgeVariant(status: string): 'success' | 'info' | 'primary' | 'secondary' | 'warning' | 'danger' {
	switch (status.toLowerCase()) {
		case 'quotepending':
			return 'info';
		case 'draft':
			return 'secondary';
		case 'quotesubmitted':
			return 'primary';
		case 'quoteaccepted':
			return 'success';
		case 'quoterejected':
			return 'danger';
		case 'initialpaymentpending':
			return 'warning';
		case 'initialpaymentcomplete':
			return 'success';
		case 'inprogress':
			return 'warning';
		case 'completed':
			return 'success';
		case 'cancelled':
			return 'danger';
		default:
			return 'secondary';
	}
}

/**
 * Check if client can edit project tasks
 * Clients can only edit tasks for ClientManaged projects
 * @param project - Project or ProjectDetails
 * @returns true if client can edit tasks, false otherwise
 */
export function canClientEditTasks(project: ProjectDto | ProjectDetailsDto): boolean {
	return project.managementType === ProjectManagementType.ClientManaged;
}

/**
 * Check if project is managed by Digital Engineers
 * @param project - Project or ProjectDetails
 * @returns true if managed by Digital Engineers, false otherwise
 */
export function isDigitalEngineersManaged(project: ProjectDto | ProjectDetailsDto): boolean {
	return project.managementType === ProjectManagementType.DigitalEngineersManaged;
}

/**
 * Get human-readable label for project management type
 */
export function getManagementTypeLabel(managementType: string): string {
	return managementType === ProjectManagementType.ClientManaged 
		? 'Client Managed' 
		: 'Novobid Managed';
}

/**
 * Check if client can invite specialists to the project
 * Conditions: ClientManaged + status is InitialPaymentComplete or InProgress
 */
export function canClientInviteSpecialists(project: ProjectDetailsDto): boolean {
	// Check management type
	if (project.managementType !== ProjectManagementType.ClientManaged) {
		return false;
	}

	// Allowed statuses for bidding
	const allowedStatuses = [
		ProjectStatus.InitialPaymentComplete,
		ProjectStatus.InProgress,
	];

	// Allow bidding if status is in allowed list
	return allowedStatuses.includes(project.status as ProjectStatus);
}
