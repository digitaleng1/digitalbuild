import { useState, useEffect, useMemo } from 'react';
import bidService from '@/services/bidService';
import type { BidResponseDto, GroupedBidResponses } from '@/types/admin-bid';

interface UseBidResponsesResult {
	groupedResponses: GroupedBidResponses[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export const useBidResponses = (projectId: number): UseBidResponsesResult => {
	const [responses, setResponses] = useState<BidResponseDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchResponses = async () => {
		try {
			setLoading(true);
			setError(null);
			console.log('🔍 [useBidResponses] Fetching responses for projectId:', projectId);
			const data = await bidService.getBidResponsesByProjectId(projectId);
			console.log('✅ [useBidResponses] Received data:', data);
			setResponses(data);
		} catch (err: any) {
			const errorMessage = err?.message || 'Failed to load bid responses';
			console.error('❌ [useBidResponses] Error:', err);
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (projectId) {
			fetchResponses();
		}
	}, [projectId]);

	const groupedResponses = useMemo<GroupedBidResponses[]>(() => {
		const grouped = new Map<number, BidResponseDto[]>();

		console.log('🔄 [useBidResponses] Grouping responses:', responses);

		responses.forEach((response) => {
			if (!grouped.has(response.licenseTypeId)) {
				grouped.set(response.licenseTypeId, []);
			}
			grouped.get(response.licenseTypeId)!.push(response);
		});

		const result = Array.from(grouped.entries()).map(([licenseTypeId, responseList]) => ({
			licenseTypeId,
			licenseTypeName: responseList[0]?.licenseTypeName || 'Unknown',
			responses: responseList,
		}));

		console.log('📊 [useBidResponses] Grouped result:', result);
		return result;
	}, [responses]);

	return {
		groupedResponses,
		loading,
		error,
		refetch: fetchResponses,
	};
};
