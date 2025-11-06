import { useState, useCallback } from 'react';
import quoteService from '@/services/quoteService';
import type { ProjectQuoteDto, CreateQuoteRequest } from '@/types/quote';
import { useToast } from '@/contexts/ToastContext';

export function useProjectQuote() {
	const [quote, setQuote] = useState<ProjectQuoteDto | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { showSuccess, showError } = useToast();

	const fetchQuote = useCallback(async (projectId: number) => {
		setLoading(true);
		setError(null);
		try {
			const data = await quoteService.getProjectQuoteData(projectId);
			setQuote(data);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to load quote data';
			setError(errorMessage);
			showError('Error', errorMessage);
		} finally {
			setLoading(false);
		}
	}, [showError]);

	const submitQuote = useCallback(async (projectId: number, data: CreateQuoteRequest) => {
		setLoading(true);
		setError(null);
		try {
			await quoteService.submitQuote(projectId, data);
			showSuccess('Success', 'Quote submitted to client successfully');
			await fetchQuote(projectId);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to submit quote';
			setError(errorMessage);
			showError('Error', errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [showSuccess, showError, fetchQuote]);

	const updateQuote = useCallback(async (projectId: number, data: CreateQuoteRequest) => {
		setLoading(true);
		setError(null);
		try {
			await quoteService.updateQuote(projectId, data);
			showSuccess('Success', 'Quote updated successfully');
			await fetchQuote(projectId);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to update quote';
			setError(errorMessage);
			showError('Error', errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [showSuccess, showError, fetchQuote]);

	const acceptQuote = useCallback(async (projectId: number) => {
		setLoading(true);
		setError(null);
		try {
			await quoteService.acceptQuote(projectId);
			showSuccess('Success', 'Quote accepted successfully');
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to accept quote';
			setError(errorMessage);
			showError('Error', errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [showSuccess, showError]);

	const rejectQuote = useCallback(async (projectId: number, reason?: string) => {
		setLoading(true);
		setError(null);
		try {
			await quoteService.rejectQuote(projectId, reason ? { rejectionReason: reason } : undefined);
			showSuccess('Success', 'Quote rejected successfully');
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to reject quote';
			setError(errorMessage);
			showError('Error', errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [showSuccess, showError]);

	return {
		quote,
		loading,
		error,
		fetchQuote,
		submitQuote,
		updateQuote,
		acceptQuote,
		rejectQuote,
	};
}
