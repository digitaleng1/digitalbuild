import { useState, useEffect, useCallback } from 'react';
import bidService from '@/services/bidService';
import type { SpecialistForBid } from '@/types/bid';
import { getErrorMessage } from '@/utils/errorHandler';

export const useAvailableSpecialists = (projectId: number | undefined) => {
	const [specialists, setSpecialists] = useState<SpecialistForBid[]>([]);
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
			const data = await bidService.getSpecialistsForProject(projectId);
			setSpecialists(data);
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			console.error('Failed to fetch available specialists:', err);
		} finally {
			setLoading(false);
		}
	}, [projectId]);

	useEffect(() => {
		fetchSpecialists();
	}, [fetchSpecialists]);

	return { specialists, loading, error, refetch: fetchSpecialists };
};
