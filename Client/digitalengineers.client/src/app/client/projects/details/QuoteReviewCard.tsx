import { useState } from 'react';
import { Card, CardBody, Button, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import { useProjectQuote } from '@/app/shared/hooks/useProjectQuote';
import type { ProjectDetailsDto } from '@/types/project';

interface QuoteReviewCardProps {
	project: ProjectDetailsDto;
	onQuoteAccepted?: () => void;
	onQuoteRejected?: () => void;
}

const QuoteReviewCard = ({ project, onQuoteAccepted, onQuoteRejected }: QuoteReviewCardProps) => {
	const { acceptQuote, rejectQuote } = useProjectQuote();
	const [showAcceptModal, setShowAcceptModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [rejectionReason, setRejectionReason] = useState('');
	const [isProcessing, setIsProcessing] = useState(false);

	if (!project.quotedAmount || project.status !== 'QuoteSubmitted') {
		return null;
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const handleAccept = async () => {
		setIsProcessing(true);
		try {
			await acceptQuote(project.id);
			setShowAcceptModal(false);
			onQuoteAccepted?.();
		} catch (error) {
			// Error handled by hook
		} finally {
			setIsProcessing(false);
		}
	};

	const handleReject = async () => {
		setIsProcessing(true);
		try {
			await rejectQuote(project.id, rejectionReason.trim() || undefined);
			setShowRejectModal(false);
			setRejectionReason('');
			onQuoteRejected?.();
		} catch (error) {
			// Error handled by hook
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<>
			<Card className="border-primary">
				<CardBody>
					<CardTitle
						containerClass="d-flex justify-content-between align-items-center mb-3"
						title={
							<h4 className="header-title mb-0">
								<i className="mdi mdi-cash-multiple me-2 text-primary"></i>
								Quote from Novobid
							</h4>
						}
					/>

					<Alert variant="primary" className="mb-3">
						<i className="mdi mdi-information-outline me-2"></i>
						You have received a quote for your project. Please review and accept or reject it.
					</Alert>

					{/* Project Info */}
					<div className="mb-3">
						<h6 className="text-muted mb-2">Project:</h6>
						<h5 className="mb-0">{project.name}</h5>
					</div>

					{/* Quote Amount */}
					<div className="mb-3 p-3 bg-light rounded">
						<h6 className="text-muted mb-2">Total Project Cost:</h6>
						<h2 className="mb-0 text-success">{formatCurrency(project.quotedAmount)}</h2>
					</div>

					{/* Quote Notes */}
					{project.quoteNotes && (
						<div className="mb-3">
							<h6 className="text-muted mb-2">Notes:</h6>
							<p className="mb-0 text-muted">{project.quoteNotes}</p>
						</div>
					)}

					{/* Submitted Date */}
					{project.quoteSubmittedAt && (
						<div className="mb-4">
							<small className="text-muted">
								<i className="mdi mdi-calendar me-1"></i>
								Submitted: {formatDate(project.quoteSubmittedAt)}
							</small>
						</div>
					)}

					{/* Action Buttons */}
					<div className="d-flex gap-2">
						<Button
							variant="outline-danger"
							onClick={() => setShowRejectModal(true)}
							className="flex-grow-1"
						>
							<i className="mdi mdi-close me-2"></i>
							Reject Quote
						</Button>
						<Button
							variant="success"
							onClick={() => setShowAcceptModal(true)}
							className="flex-grow-1"
						>
							<i className="mdi mdi-check me-2"></i>
							Accept Quote
						</Button>
					</div>
				</CardBody>
			</Card>

			{/* Accept Confirmation Modal */}
			<Modal show={showAcceptModal} onHide={() => !isProcessing && setShowAcceptModal(false)} centered>
				<Modal.Header closeButton={!isProcessing}>
					<Modal.Title>Accept Quote</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Are you sure you want to accept this quote for{' '}
						<strong className="text-success">{formatCurrency(project.quotedAmount)}</strong>?
					</p>
					<Alert variant="info" className="mb-0">
						<i className="mdi mdi-information-outline me-2"></i>
						By accepting this quote, you agree to proceed with the project at this price.
					</Alert>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowAcceptModal(false)} disabled={isProcessing}>
						Cancel
					</Button>
					<Button variant="success" onClick={handleAccept} disabled={isProcessing}>
						{isProcessing ? (
							<>
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
									className="me-2"
								/>
								Accepting...
							</>
						) : (
							<>
								<i className="mdi mdi-check me-2"></i>
								Yes, Accept Quote
							</>
						)}
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Reject Confirmation Modal */}
			<Modal show={showRejectModal} onHide={() => !isProcessing && setShowRejectModal(false)} centered>
				<Modal.Header closeButton={!isProcessing}>
					<Modal.Title>Reject Quote</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to reject this quote?</p>
					<Form.Group className="mb-3">
						<Form.Label>Rejection Reason (Optional)</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							maxLength={500}
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder="Provide a reason for rejection..."
							disabled={isProcessing}
						/>
						<Form.Text className="text-muted">
							{rejectionReason.length}/500 characters
						</Form.Text>
					</Form.Group>
					<Alert variant="warning" className="mb-0">
						<i className="mdi mdi-alert-outline me-2"></i>
						After rejection, the admin can send you a new quote with a different amount.
					</Alert>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowRejectModal(false)} disabled={isProcessing}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleReject} disabled={isProcessing}>
						{isProcessing ? (
							<>
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
									className="me-2"
								/>
								Rejecting...
							</>
						) : (
							<>
								<i className="mdi mdi-close me-2"></i>
								Yes, Reject Quote
							</>
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default QuoteReviewCard;
