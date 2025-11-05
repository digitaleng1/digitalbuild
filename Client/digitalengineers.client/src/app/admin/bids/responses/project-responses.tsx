import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useBidResponses } from '../hooks/useBidResponses';
import ResponsesGroup from './components/ResponsesGroup';
import AcceptBidModal from '@/components/modals/AcceptBidModal';
import RejectBidModal from '@/components/modals/RejectBidModal';
import BidChat from '@/components/modals/BidChatModal';

const BidResponsesByProjectPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const projectId = parseInt(id || '0', 10);

	const { 
		groupedResponses, 
		loading, 
		error,
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
		showMessageModal,
		handleOpenMessageModal,
		handleCloseMessageModal
	} = useBidResponses(projectId);

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
				<PageBreadcrumb title="Bid Responses" subName="Admin / Bids" />
				<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
					<Spinner animation="border" variant="primary" />
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<PageBreadcrumb title="Bid Responses" subName="Admin / Bids" />
				<Alert variant="danger">
					<strong>Error:</strong> {error}
				</Alert>
			</>
		);
	}

	const projectInfo = groupedResponses[0]?.responses[0];

	return (
		<>
			<PageBreadcrumb title="Bid Responses" subName="Admin / Bids" />

			{projectInfo && (
				<Row>
					<Col xs={12}>
						<Card>
							<Card.Body>
								<div className="d-flex justify-content-between align-items-start">
									<div className="flex-grow-1">
										<Row className="g-3">
											{/* Project Column */}
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

											{/* Client Column */}
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

											{/* Budget Column */}
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

											{/* Deadline Column */}
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
										onClick={() => navigate('/admin/bids')}
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
								onApprove={handleOpenApproveModal}
								onReject={handleOpenRejectModal}
								onMessage={handleOpenMessageModal}
							/>
						))}
					</Col>
				</Row>
			)}

			{selectedResponse && (
				<>
					<AcceptBidModal
						show={showApproveModal}
						onHide={handleCloseApproveModal}
						onConfirm={handleApprove}
						proposedPrice={selectedResponse.proposedPrice}
						loading={approving}
					/>
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

export default BidResponsesByProjectPage;
