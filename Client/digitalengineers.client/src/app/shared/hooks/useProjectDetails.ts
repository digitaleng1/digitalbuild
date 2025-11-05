import { useState, useEffect, useCallback } from 'react';
import projectService from '@/services/projectService';
import type { ProjectDetailsDto } from '@/types/project';
import { useToast } from '@/contexts';
import { getErrorMessage, getErrorTitle } from '@/utils/errorHandler';

interface UseProjectDetailsReturn {
	project: ProjectDetailsDto | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	updateProjectStatus: (newStatus: string) => void;
}

/**
 * Hook for fetching project details by ID
 * @param projectId - Project ID to fetch
 */
export default function useProjectDetails(projectId: number | undefined): UseProjectDetailsReturn {
	const [project, setProject] = useState<ProjectDetailsDto | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { showError } = useToast();

	const fetchProjectDetails = async () => {
		if (!projectId) {
			setLoading(false);
			setError('Project ID is required');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const data = await projectService.getProjectById(projectId);
			setProject(data);
		} catch (err: any) {
			console.error('Error fetching project details:', err);

			const errorTitle = getErrorTitle(err);
			const errorMessage = getErrorMessage(err);

			setError(errorMessage);
			setProject(null);

			showError(errorTitle, errorMessage);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Optimistically update project status in UI without refetch
	 */
	const updateProjectStatus = useCallback((newStatus: string) => {
		setProject(prevProject => 
			prevProject 
				? { 
					...prevProject, 
					status: newStatus,
					updatedAt: new Date().toISOString()
				}
				: null
		);
	}, []);

	useEffect(() => {
		fetchProjectDetails();
	}, [projectId]);

	return {
		project,
		loading,
		error,
		refetch: fetchProjectDetails,
		updateProjectStatus,
	};
}
