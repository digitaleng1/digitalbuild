import React, { useMemo } from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { BidResponseDto } from '@/types/admin-bid';

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
