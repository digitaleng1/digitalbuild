import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useBidResponses } from '@/app/admin/bids/hooks/useBidResponses';
import { ResponsesGroup } from '@/app/shared/components/bids';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import RejectBidModal from '@/components/modals/RejectBidModal';
import BidChat from '@/components/modals/BidChatModal';
import bidService from '@/services/bidService';
import { useToast } from '@/contexts';
import { getErrorMessage, getErrorTitle } from '@/utils/errorHandler';
import type { BidResponseDto } from '@/types/admin-bid';

const ClientBidResponsesByProjectPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const projectId = parseInt(id || '0', 10);
	const { showSuccess, showError } = useToast();

	const { 
		groupedResponses, 
		loading, 
		error,
		selectedResponse,
		showRejectModal,
		handleOpenRejectModal,
		handleCloseRejectModal,
		handleReject,
		rejecting,
		showMessageModal,
		handleOpenMessageModal,
		handleCloseMessageModal,
		refetch
	} = useBidResponses(projectId);

	// Client-specific state for confirm dialog
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [confirmingResponse, setConfirmingResponse] = useState<BidResponseDto | null>(null);
	const [confirming, setConfirming] = useState(false);

	const handleOpenConfirmDialog = useCallback((response: BidResponseDto) => {
		setConfirmingResponse(response);
		setShowConfirmDialog(true);
	}, []);

	const handleCloseConfirmDialog = useCallback(() => {
		if (!confirming) {
			setShowConfirmDialog(false);
			setConfirmingResponse(null);
		}
	}, [confirming]);

	const handleConfirmAccept = useCallback(async () => {
		if (!confirmingResponse || confirmingResponse.id === 0) {
			showError('Error', 'Cannot approve bid without response');
			return;
		}

		try {
			setConfirming(true);
			// Client accepts without markup or comment
			await bidService.acceptBidResponse(confirmingResponse.id, {
				adminMarkupPercentage: 0,
				adminComment: undefined
			});
			showSuccess('Success', 'Bid response has been approved successfully. Specialist will be notified.');
			await refetch();
			handleCloseConfirmDialog();
		} catch (err: any) {
			const errorMessage = getErrorMessage(err);
			const errorTitle = getErrorTitle(err);
			console.error('❌ [ClientBidResponses] Error approving bid:', err);
			showError(errorTitle, errorMessage);
		} finally {
			setConfirming(false);
		}
	}, [confirmingResponse, showError, showSuccess, refetch, handleCloseConfirmDialog]);

	const formatDate = (dateString: string | null) => {
		if (!dateString) return 'Not set';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="Bid Responses" subName="Client / Bids" />
				<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
					<Spinner animation="border" variant="primary" />
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<PageBreadcrumb title="Bid Responses" subName="Client / Bids" />
				<Alert variant="danger">
					<strong>Error:</strong> {error}
				</Alert>
			</>
		);
	}

	const projectInfo = groupedResponses[0]?.responses[0];

	return (
		<>
			<PageBreadcrumb title="Bid Responses" subName="Client / Bids" />

			{projectInfo && (
				<Row>
					<Col xs={12}>
						<Card>
							<Card.Body>
								<div className="d-flex justify-content-between align-items-start">
									<div className="flex-grow-1">
										<Row className="g-3">
											<Col md={3}>
												<div className="mb-2">
													<small className="text-muted">Project</small>
												</div>
												<div className="d-flex align-items-center">
													{projectInfo.projectThumbnailUrl ? (
														<img
															src={projectInfo.projectThumbnailUrl}
															alt={projectInfo.projectName}
															className="rounded-circle me-2"
															style={{ width: '32px', height: '32px', objectFit: 'cover' }}
														/>
													) : (
														<div 
															className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
															style={{ width: '32px', height: '32px' }}
														>
															<i className="mdi mdi-image-off text-muted"></i>
														</div>
													)}
													<strong>{projectInfo.projectName}</strong>
												</div>
											</Col>

											<Col md={3}>
												<div className="mb-2">
													<small className="text-muted">Client</small>
												</div>
												<div className="d-flex align-items-center">
													{projectInfo.clientProfilePictureUrl ? (
														<img
															src={projectInfo.clientProfilePictureUrl}
															alt={projectInfo.clientName}
															className="rounded-circle me-2"
															style={{ width: '32px', height: '32px', objectFit: 'cover' }}
														/>
													) : (
														<div 
															className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
															style={{ width: '32px', height: '32px' }}
														>
															<i className="mdi mdi-account text-muted"></i>
														</div>
													)}
													<strong>{projectInfo.clientName}</strong>
												</div>
											</Col>

											<Col md={3}>
												<div className="mb-2">
													<small className="text-muted">Budget</small>
												</div>
												<div>
													<strong className="fs-5">
														{projectInfo.projectBudget ? `$${projectInfo.projectBudget.toLocaleString()}` : 'Not set'}
													</strong>
												</div>
											</Col>

											<Col md={3}>
												<div className="mb-2">
													<small className="text-muted">Deadline</small>
												</div>
												<div>
													<strong className="fs-5">{formatDate(projectInfo.projectDeadline)}</strong>
												</div>
											</Col>
										</Row>
									</div>

									<Button 
										variant="secondary" 
										onClick={() => navigate('/client/bids')}
										className="ms-3"
									>
										<i className="mdi mdi-arrow-left me-1"></i>
										Back
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			{groupedResponses.length === 0 ? (
				<Row>
					<Col xs={12}>
						<Alert variant="info">
							<i className="mdi mdi-information-outline me-2"></i>
							No bid responses found for this project.
						</Alert>
					</Col>
				</Row>
			) : (
				<Row>
					<Col xs={12}>
						{groupedResponses.map((group) => (
							<ResponsesGroup 
								key={group.licenseTypeId} 
								group={group}
								onApprove={handleOpenConfirmDialog}
								onReject={handleOpenRejectModal}
								onMessage={handleOpenMessageModal}
							/>
						))}
					</Col>
				</Row>
			)}

			{/* Client uses Confirm Dialog instead of AcceptBidModal */}
			{confirmingResponse && (
				<ConfirmDialog
					show={showConfirmDialog}
					onHide={handleCloseConfirmDialog}
					onConfirm={handleConfirmAccept}
					title="Accept Bid Response"
					message={`Are you sure you want to accept the bid response from ${confirmingResponse.specialistName} for $${confirmingResponse.proposedPrice.toLocaleString()}?`}
					confirmText="Yes, Accept Bid"
					confirmVariant="success"
					loading={confirming}
					icon="mdi mdi-check-circle-outline"
					alertVariant="info"
					alertMessage="The specialist will be notified via email and push notification about your acceptance."
				/>
			)}

			{selectedResponse && (
				<>
					<RejectBidModal
						show={showRejectModal}
						onHide={handleCloseRejectModal}
						onConfirm={handleReject}
						specialistName={selectedResponse.specialistName}
						loading={rejecting}
					/>
					<BidChat
						mode="modal"
						show={showMessageModal}
						onHide={handleCloseMessageModal}
						bidRequestId={selectedResponse.bidRequestId}
						recipientName={selectedResponse.specialistName}
						recipientAvatar={selectedResponse.specialistProfilePicture}
					/>
				</>
			)}
		</>
	);
};

export default ClientBidResponsesByProjectPage;
