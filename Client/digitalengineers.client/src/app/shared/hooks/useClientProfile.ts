import { useState, useEffect, useCallback } from 'react';
import clientService from '@/services/clientService';
import type { ClientProfile } from '@/types/client';
import { useToast } from '@/contexts/ToastContext';

export const useClientProfile = () => {
	const [profile, setProfile] = useState<ClientProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { showError } = useToast();

	const fetchProfile = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await clientService.getCurrentClientProfile();
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
