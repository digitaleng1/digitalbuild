import { useState, useEffect, useCallback } from 'react';
import projectService from '@/services/projectService';
import type { ProjectSpecialistDto } from '@/types/project';
import { getErrorMessage } from '@/utils/errorHandler';

export const useProjectTeamMembers = (projectId: number | undefined) => {
	const [teamMembers, setTeamMembers] = useState<ProjectSpecialistDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTeamMembers = useCallback(async () => {
		if (!projectId) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await projectService.getProjectTeamMembers(projectId);
			setTeamMembers(data);
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			console.error('Failed to fetch project team members:', err);
		} finally {
			setLoading(false);
		}
	}, [projectId]);

	useEffect(() => {
		fetchTeamMembers();
	}, [fetchTeamMembers]);

	return { teamMembers, loading, error, refetch: fetchTeamMembers };
};
