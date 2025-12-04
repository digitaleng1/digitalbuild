import { useState } from 'react';
import clientService from '@/services/clientService';
import type { UpdateClientProfile } from '@/types/client';
import { useToast } from '@/contexts/ToastContext';

export const useUpdateClient = () => {
	const [loading, setLoading] = useState(false);
	const { showSuccess, showError } = useToast();

	const updateClient = async (data: UpdateClientProfile) => {
		setLoading(true);
		try {
			const updated = await clientService.updateCurrentClientProfile(data);
			showSuccess('Success', 'Profile updated successfully');
			return updated;
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || 'Failed to update profile';
			showError('Error', errorMsg);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { updateClient, loading };
};
