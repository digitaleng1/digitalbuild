import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Button, Badge, Row, Col, Spinner, ListGroup } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { BidResponseDto } from '@/types/admin-bid';
import type { BidResponseAttachment } from '@/types/bid-attachment';
import bidService from '@/services/bidService';
import { getFileIcon, formatFileSize } from '@/utils/fileUtils';

interface ViewBidProposalModalProps {
	show: boolean;
	onHide: () => void;
	response: BidResponseDto;
	onApprove?: (response: BidResponseDto) => void;
	onReject?: (response: BidResponseDto) => void;
}

const ViewBidProposalModal: React.FC<ViewBidProposalModalProps> = ({ 
	show, 
	onHide, 
	response, 
	onApprove, 
	onReject 
}) => {
	const [attachments, setAttachments] = useState<BidResponseAttachment[]>([]);
	const [loadingAttachments, setLoadingAttachments] = useState(false);

	useEffect(() => {
		if (show && response.id) {
			loadAttachments();
		}
	}, [show, response.id]);

	const loadAttachments = async () => {
		try {
			setLoadingAttachments(true);
			const data = await bidService.getBidResponseAttachments(response.id);
			setAttachments(data);
		} catch (err) {
			console.error('Failed to load attachments:', err);
			setAttachments([]);
		} finally {
			setLoadingAttachments(false);
		}
	};

	const formatDate = useMemo(() => {
		return (dateString: string) => {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		};
	}, []);

	const renderStars = useMemo(() => {
		return (rating: number) => {
			const fullStars = Math.floor(rating);
			const hasHalfStar = rating % 1 >= 0.5;
			
			return (
				<div className="d-flex align-items-center">
					{[...Array(5)].map((_, i) => {
						if (i < fullStars) {
							return <Icon key={i} icon="mdi:star" className="text-warning" width={16} />;
						} else if (i === fullStars && hasHalfStar) {
							return <Icon key={i} icon="mdi:star-half-full" className="text-warning" width={16} />;
						} else {
							return <Icon key={i} icon="mdi:star-outline" className="text-muted" width={16} />;
						}
					})}
					<span className="ms-2 text-muted small">({rating.toFixed(1)})</span>
				</div>
			);
		};
	}, []);

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>
					<div className="d-flex align-items-center">
						<img
							src={response.specialistProfilePicture || '/assets/images/users/avatar-default.jpg'}
							alt={response.specialistName}
							className="rounded-circle me-3"
							style={{ width: '48px', height: '48px', objectFit: 'cover' }}
						/>
						<div>
							<div className="fw-bold">{response.specialistName}</div>
							<div className="text-muted small">{response.licenseTypeName}</div>
						</div>
					</div>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/* Main Information */}
				<Row className="mb-4">
					<Col md={6}>
						<div className="mb-3">
							<small className="text-muted d-block mb-1">Proposed Price</small>
							<h4 className="mb-0 text-primary">${response.proposedPrice.toLocaleString()}</h4>
						</div>
					</Col>
					<Col md={6}>
						<div className="mb-3">
							<small className="text-muted d-block mb-1">Estimated Duration</small>
							<h4 className="mb-0">{response.estimatedDays} days</h4>
						</div>
					</Col>
				</Row>

				<Row className="mb-4">
					<Col md={4}>
						<div className="mb-3">
							<small className="text-muted d-block mb-1">Rating</small>
							{renderStars(response.specialistRating)}
						</div>
					</Col>
					<Col md={4}>
						<div className="mb-3">
							<small className="text-muted d-block mb-1">Experience</small>
							<div className="fw-semibold">{response.yearsOfExperience} years</div>
						</div>
					</Col>
					<Col md={4}>
						<div className="mb-3">
							<small className="text-muted d-block mb-1">Availability</small>
							<Badge bg={response.isAvailable ? 'success' : 'secondary'}>
								{response.isAvailable ? 'Available' : 'Unavailable'}
							</Badge>
						</div>
					</Col>
				</Row>

				{/* Cover Letter */}
				<div className="mb-4">
					<h5 className="mb-2">
						<Icon icon="mdi:file-document-outline" className="me-2" />
						Cover Letter
					</h5>
					<div 
						className="p-3 border rounded bg-light" 
						style={{ whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}
					>
						{response.coverLetter || 'No cover letter provided.'}
					</div>
				</div>

				{/* Attachments */}
				<div className="mb-4">
					<h5 className="mb-2">
						<Icon icon="mdi:paperclip" className="me-2" />
						Attachments {!loadingAttachments && attachments.length > 0 && `(${attachments.length})`}
					</h5>
					{loadingAttachments ? (
						<div className="text-center py-3">
							<Spinner animation="border" size="sm" />
						</div>
					) : attachments.length > 0 ? (
						<ListGroup>
							{attachments.map((attachment) => (
								<ListGroup.Item key={attachment.id} className="d-flex align-items-center justify-content-between">
									<div className="d-flex align-items-center">
										<span className="me-2" style={{ fontSize: '1.5rem' }}>
											{getFileIcon(attachment.fileType)}
										</span>
										<div>
											<div className="fw-semibold">{attachment.fileName}</div>
											{attachment.description && (
												<div className="text-muted small">{attachment.description}</div>
											)}
											<div className="text-muted small">
												<Badge bg="secondary" pill>{formatFileSize(attachment.fileSize)}</Badge>
											</div>
										</div>
									</div>
									<Button
										variant="outline-primary"
										size="sm"
										href={attachment.downloadUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Icon icon="mdi:download" className="me-1" />
										Download
									</Button>
								</ListGroup.Item>
							))}
						</ListGroup>
					) : (
						<div className="text-muted text-center py-3 border rounded bg-light">
							<Icon icon="mdi:file-document-outline" width={48} className="text-muted mb-2" />
							<div>No attachments provided</div>
						</div>
					)}
				</div>

				{/* Submitted At */}
				<div className="text-muted small">
					<Icon icon="mdi:clock-outline" className="me-1" />
					Submitted on {formatDate(response.submittedAt)}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="light" onClick={onHide}>
					Close
				</Button>
				{response.status.toLowerCase() === 'responded' && (
					<>
						{onReject && (
							<Button 
								variant="danger" 
								onClick={() => {
									onHide();
									onReject(response);
								}}
							>
								<Icon icon="mdi:close-circle" className="me-1" />
								Reject
							</Button>
						)}
						{onApprove && (
							<Button 
								variant="success" 
								onClick={() => {
									onHide();
									onApprove(response);
								}}
							>
								<Icon icon="mdi:check-circle" className="me-1" />
								Approve Bid
							</Button>
						)}
					</>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default ViewBidProposalModal;
