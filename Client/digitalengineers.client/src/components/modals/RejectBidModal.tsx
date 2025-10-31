import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface RejectBidModalProps {
	show: boolean;
	onHide: () => void;
	onConfirm: (reason: string) => void;
	specialistName?: string;
	loading?: boolean;
}

const RejectBidModal: React.FC<RejectBidModalProps> = ({
	show,
	onHide,
	onConfirm,
	specialistName,
	loading = false
}) => {
	const [reason, setReason] = useState<string>('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onConfirm(reason);
	};

	const handleClose = () => {
		setReason('');
		onHide();
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton>
					<Modal.Title>Reject Bid Response</Modal.Title>
				</Modal.Header>
				
				<Modal.Body>
					{specialistName && (
						<div className="mb-3">
							<p className="text-muted">
								You are about to reject the bid response from <strong>{specialistName}</strong>.
							</p>
						</div>
					)}

					<div className="mb-3">
						<Form.Label htmlFor="rejectionReason">
							Reason for Rejection <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							as="textarea"
							id="rejectionReason"
							rows={4}
							maxLength={500}
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="Please provide a reason for rejecting this bid response"
							required
							disabled={loading}
						/>
						<Form.Text className="text-muted">
							{reason.length}/500 characters
						</Form.Text>
					</div>

					<div className="alert alert-warning d-flex align-items-center" role="alert">
						<i className="mdi mdi-alert-outline me-2 fs-4"></i>
						<div>
							<strong>Warning:</strong> This action cannot be undone. The specialist will be notified about the rejection.
						</div>
					</div>
				</Modal.Body>
				
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="danger" type="submit" disabled={loading || !reason.trim()}>
						{loading ? 'Rejecting...' : 'Reject Bid'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default RejectBidModal;
