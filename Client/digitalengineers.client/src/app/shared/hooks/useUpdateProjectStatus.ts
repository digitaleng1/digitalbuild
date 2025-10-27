import { useState } from 'react';
import projectService from '@/services/projectService';
import { useToast } from '@/contexts/ToastContext';
import { getErrorMessage, getErrorTitle } from '@/utils/errorHandler';

interface UseUpdateProjectStatusReturn {
	isUpdating: boolean;
	error: string | null;
	updateStatus: (projectId: number, status: string) => Promise<void>;
}

export default function useUpdateProjectStatus(): UseUpdateProjectStatusReturn {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { showSuccess, showError } = useToast();

	const updateStatus = async (projectId: number, status: string): Promise<void> => {
		setIsUpdating(true);
		setError(null);

		try {
			await projectService.updateProjectStatus(projectId, status);
			showSuccess('Success', 'Project status updated successfully');
		} catch (err: any) {
			const errorTitle = getErrorTitle(err);
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			showError(errorTitle, errorMessage);
			throw err;
		} finally {
			setIsUpdating(false);
		}
	};

	return {
		isUpdating,
		error,
		updateStatus,
	};
}
