import { useState, useEffect, useCallback } from 'react';
import reviewService from '@/services/reviewService';
import type { Review } from '@/types/review';
import { useToast } from '@/contexts/ToastContext';

export const useReviews = (specialistId: number) => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { showError } = useToast();

	const fetchReviews = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await reviewService.getSpecialistReviews(specialistId);
			setReviews(data);
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || 'Failed to load reviews';
			setError(errorMsg);
			showError('Error', errorMsg);
		} finally {
			setLoading(false);
		}
	}, [specialistId, showError]);

	useEffect(() => {
		fetchReviews();
	}, [fetchReviews]);

	return { reviews, loading, error, refetch: fetchReviews };
};
