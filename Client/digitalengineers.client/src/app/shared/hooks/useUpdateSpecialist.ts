import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import specialistService from '@/services/specialistService';
import type { UpdateSpecialistDto, SpecialistProfile } from '@/types/specialist';

export const useUpdateSpecialist = () => {
	const [loading, setLoading] = useState(false);
	const { showSuccess, showError } = useToast();

	const updateSpecialist = async (id: number, data: UpdateSpecialistDto): Promise<SpecialistProfile> => {
		setLoading(true);
		try {
			const result = await specialistService.updateSpecialist(id, data);
			showSuccess('Success', 'Profile updated successfully');
			return result;
		} catch (error: any) {
			showError('Error', error.response?.data?.message || 'Failed to update profile');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return { updateSpecialist, loading };
};
