import { useState, useEffect } from 'react';
import lookupService from '@/services/lookupService';
import type { LicenseType } from '@/types/lookup';

export const useLicenseTypes = () => {
	const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLicenseTypes = async () => {
			try {
				setLoading(true);
				const data = await lookupService.getLicenseTypes();
				setLicenseTypes(data);
			} catch (err: any) {
				setError(err.message || 'Failed to load license types');
			} finally {
				setLoading(false);
			}
		};

		fetchLicenseTypes();
	}, []);

	return { licenseTypes, loading, error };
};
