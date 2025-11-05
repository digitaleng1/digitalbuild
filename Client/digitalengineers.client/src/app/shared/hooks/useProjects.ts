import { useState, useEffect, useCallback } from 'react';
import projectService from '@/services/projectService';
import type { ProjectDto } from '@/types/project';

interface UseProjectsReturn {
	projects: ProjectDto[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	updateProjectStatus: (projectId: number, newStatus: string) => void;
}

/**
 * Shared hook for fetching and managing projects list
 * Used by Client, Admin, Provider roles
 */
export default function useProjects(): UseProjectsReturn {
	const [projects, setProjects] = useState<ProjectDto[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProjects = async () => {
		setLoading(true);
		setError(null);
		
		try {
			const data = await projectService.getProjects();
			// Ensure data is array
			setProjects(Array.isArray(data) ? data : []);
		} catch (err: any) {
			console.error('Error fetching projects:', err);
			
			// Reset projects to empty array on error
			setProjects([]);
			
			// Extract error message
			let errorMessage = 'Failed to load projects';
			
			if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			} else if (err.message) {
				errorMessage = err.message;
			}
			
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Optimistically update project status in UI without refetch
	 */
	const updateProjectStatus = useCallback((projectId: number, newStatus: string) => {
		setProjects(prevProjects => 
			prevProjects.map(project => 
				project.id === projectId 
					? { ...project, status: newStatus }
					: project
			)
		);
	}, []);

	useEffect(() => {
		fetchProjects();
	}, []);

	return {
		projects,
		loading,
		error,
		refetch: fetchProjects,
		updateProjectStatus,
	};
}
