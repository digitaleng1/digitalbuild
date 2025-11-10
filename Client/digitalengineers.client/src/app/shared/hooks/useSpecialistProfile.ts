import { useState, useEffect, useCallback } from 'react';
import specialistService from '@/services/specialistService';
import type { SpecialistProfile } from '@/types/specialist';
import { useToast } from '@/contexts/ToastContext';

export const useSpecialistProfile = () => {
	const [profile, setProfile] = useState<SpecialistProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { showError } = useToast();

	const fetchProfile = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await specialistService.getCurrentSpecialistProfile();
			setProfile(data);
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || 'Failed to load profile';
			setError(errorMsg);
			showError('Error', errorMsg);
		} finally {
			setLoading(false);
		}
	}, [showError]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	return { profile, loading, error, refetch: fetchProfile };
};
