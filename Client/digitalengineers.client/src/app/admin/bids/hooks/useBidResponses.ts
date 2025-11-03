import { useState, useEffect, useMemo } from 'react';
import bidService from '@/services/bidService';
import type { BidResponseDto, GroupedBidResponses } from '@/types/admin-bid';
import type { AcceptBidResponseDto } from '@/types/bid';
import { useToast } from '@/contexts';
import { getErrorMessage, getErrorTitle } from '@/utils/errorHandler';

interface UseBidResponsesResult {
	groupedResponses: GroupedBidResponses[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	showApproveModal: boolean;
	selectedResponse: BidResponseDto | null;
	handleOpenApproveModal: (response: BidResponseDto) => void;
	handleCloseApproveModal: () => void;
	handleApprove: (data: AcceptBidResponseDto) => Promise<void>;
	approving: boolean;
	showRejectModal: boolean;
	handleOpenRejectModal: (response: BidResponseDto) => void;
	handleCloseRejectModal: () => void;
	handleReject: (reason: string) => Promise<void>;
	rejecting: boolean;
}

export const useBidResponses = (projectId: number): UseBidResponsesResult => {
	const { showSuccess, showError } = useToast();
	const [responses, setResponses] = useState<BidResponseDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [selectedResponse, setSelectedResponse] = useState<BidResponseDto | null>(null);
	const [approving, setApproving] = useState(false);
	const [rejecting, setRejecting] = useState(false);

	const fetchResponses = async () => {
		try {
			setLoading(true);
			setError(null);
			console.log('🔍 [useBidResponses] Fetching responses for projectId:', projectId);
			const data = await bidService.getBidResponsesByProjectId(projectId);
			console.log('✅ [useBidResponses] Received data:', data);
			setResponses(data);
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			const errorTitle = getErrorTitle(err);
			console.error('❌ [useBidResponses] Error:', err);
			setError(errorMessage);
			showError(errorTitle, errorMessage);
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

	const handleOpenApproveModal = (response: BidResponseDto) => {
		setSelectedResponse(response);
		setShowApproveModal(true);
	};

	const handleCloseApproveModal = () => {
		setShowApproveModal(false);
		setSelectedResponse(null);
	};

	const handleApprove = async (data: AcceptBidResponseDto) => {
		if (!selectedResponse) return;

		try {
			setApproving(true);
			await bidService.acceptBidResponse(selectedResponse.id, data);
			showSuccess('Success', 'Bid response has been approved successfully');
			await fetchResponses();
			handleCloseApproveModal();
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			const errorTitle = getErrorTitle(err);
			console.error('❌ [useBidResponses] Error approving bid:', err);
			showError(errorTitle, errorMessage);
		} finally {
			setApproving(false);
		}
	};

	const handleOpenRejectModal = (response: BidResponseDto) => {
		setSelectedResponse(response);
		setShowRejectModal(true);
	};

	const handleCloseRejectModal = () => {
		setShowRejectModal(false);
		setSelectedResponse(null);
	};

	const handleReject = async (reason: string) => {
		if (!selectedResponse) return;

		try {
			setRejecting(true);
			await bidService.rejectBidResponse(selectedResponse.id, reason);
			showSuccess('Success', 'Bid response has been rejected');
			await fetchResponses();
			handleCloseRejectModal();
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			const errorTitle = getErrorTitle(err);
			console.error('❌ [useBidResponses] Error rejecting bid:', err);
			showError(errorTitle, errorMessage);
		} finally {
			setRejecting(false);
		}
	};

	return {
		groupedResponses,
		loading,
		error,
		refetch: fetchResponses,
		showApproveModal,
		selectedResponse,
		handleOpenApproveModal,
		handleCloseApproveModal,
		handleApprove,
		approving,
		showRejectModal,
		handleOpenRejectModal,
		handleCloseRejectModal,
		handleReject,
		rejecting,
	};
};
