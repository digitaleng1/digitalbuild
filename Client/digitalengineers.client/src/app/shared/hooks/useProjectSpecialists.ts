import { useState, useEffect, useCallback } from 'react';
import projectService from '@/services/projectService';
import type { ProjectSpecialistDto } from '@/types/project';
import { getErrorMessage } from '@/utils/errorHandler';

export const useProjectSpecialists = (projectId: number | undefined) => {
	const [specialists, setSpecialists] = useState<ProjectSpecialistDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSpecialists = useCallback(async () => {
		if (!projectId) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await projectService.getProjectTeamMembers(projectId);
			setSpecialists(data);
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			console.error('Failed to fetch project specialists:', err);
		} finally {
			setLoading(false);
		}
	}, [projectId]);

	useEffect(() => {
		fetchSpecialists();
	}, [fetchSpecialists]);

	return { specialists, loading, error, refetch: fetchSpecialists };
};
