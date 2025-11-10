import { useState, useEffect, useCallback } from 'react';
import licenseRequestService from '@/services/licenseRequestService';
import type { LicenseRequest } from '@/types/licenseRequest';
import { getErrorMessage } from '@/utils/errorHandler';

export const useLicenseRequests = () => {
	const [requests, setRequests] = useState<LicenseRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRequests = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await licenseRequestService.getMyLicenseRequests();
			setRequests(data);
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			console.error('Failed to fetch license requests:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

	return { requests, loading, error, refetch: fetchRequests };
};
