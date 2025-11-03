import { useState, useEffect, useCallback } from 'react';
import specialistService from '@/services/specialistService';
import type { ProjectDto } from '@/types/project';
import { getErrorMessage } from '@/utils/errorHandler';

export const useSpecialistProjects = (specialistId: number | undefined) => {
	const [projects, setProjects] = useState<ProjectDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProjects = useCallback(async () => {
		if (!specialistId) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await specialistService.getSpecialistProjects(specialistId);
			setProjects(Array.isArray(data) ? data : []);
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			setProjects([]);
			console.error('Failed to fetch specialist projects:', err);
		} finally {
			setLoading(false);
		}
	}, [specialistId]);

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	return { projects, loading, error, refetch: fetchProjects };
};
