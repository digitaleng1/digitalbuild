import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import type { ProfessionManagementDto } from '@/types/lookup';

interface ApproveProfessionModalProps {
	show: boolean;
	onHide: () => void;
	profession: ProfessionManagementDto | null;
	onApprove: (id: number, isApproved: boolean, rejectionReason?: string) => Promise<void>;
}

const ApproveProfessionModal: React.FC<ApproveProfessionModalProps> = ({ 
	show, 
	onHide, 
	profession, 
	onApprove 
}) => {
	const [action, setAction] = useState<'approve' | 'reject' | null>(null);
	const [rejectionReason, setRejectionReason] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleClose = () => {
		if (!loading) {
			setAction(null);
			setRejectionReason('');
			setError('');
			onHide();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!profession || !action) return;
		
		if (action === 'reject' && !rejectionReason.trim()) {
			setError('Rejection reason is required');
			return;
		}

		setLoading(true);
		setError('');
		
		try {
			await onApprove(
				profession.id, 
				action === 'approve',
				action === 'reject' ? rejectionReason : undefined
			);
			handleClose();
		} catch (err) {
			setError('Failed to process request');
		} finally {
			setLoading(false);
		}
	};

	if (!profession) return null;

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton={!loading}>
					<Modal.Title>
						{action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Review'} Profession
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="mb-3">
						<strong>Profession:</strong> {profession.name}
					</div>
					<div className="mb-3 text-muted">
						<small>{profession.description}</small>
					</div>
					{profession.createdByName && (
						<div className="mb-3">
							<small className="text-muted">
								Created by: <strong>{profession.createdByName}</strong>
								<br />
								Created at: {new Date(profession.createdAt).toLocaleDateString()}
							</small>
						</div>
					)}

					{!action && (
						<div className="d-grid gap-2">
							<Button 
								variant="success" 
								onClick={() => setAction('approve')}
								disabled={loading}
							>
								<i className="mdi mdi-check-circle me-1"></i>
								Approve Profession
							</Button>
							<Button 
								variant="danger" 
								onClick={() => setAction('reject')}
								disabled={loading}
							>
								<i className="mdi mdi-close-circle me-1"></i>
								Reject Profession
							</Button>
						</div>
					)}

					{action === 'reject' && (
						<Form.Group className="mt-3">
							<Form.Label>
								Rejection Reason <span className="text-danger">*</span>
							</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								value={rejectionReason}
								onChange={(e) => setRejectionReason(e.target.value)}
								isInvalid={!!error}
								disabled={loading}
								maxLength={1000}
								placeholder="Please provide a reason for rejection..."
							/>
							<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
						</Form.Group>
					)}

					{action === 'approve' && (
						<div className="alert alert-success mt-3">
							<i className="mdi mdi-check-circle me-2"></i>
							This profession will be approved and made available for all users.
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					{action && (
						<Button 
							variant={action === 'approve' ? 'success' : 'danger'} 
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Spinner as="span" animation="border" size="sm" className="me-2" />
									Processing...
								</>
							) : (
								<>
									<i className={`mdi ${action === 'approve' ? 'mdi-check' : 'mdi-close'} me-1`}></i>
									{action === 'approve' ? 'Approve' : 'Reject'}
								</>
							)}
						</Button>
					)}
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default ApproveProfessionModal;
