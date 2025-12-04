import { useCallback, useEffect, useState } from 'react';
import licenseRequestService from '@/services/licenseRequestService';
import type { LicenseRequest } from '@/types/licenseRequest';

export function useAdminLicenseRequests() {
	const [licenseRequests, setLicenseRequests] = useState<LicenseRequest[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchLicenseRequests = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await licenseRequestService.getPendingLicenseRequests();
			setLicenseRequests(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load license requests');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLicenseRequests();
	}, [fetchLicenseRequests]);

	return {
		licenseRequests,
		isLoading,
		error,
		refetch: fetchLicenseRequests,
	};
}
