import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Badge } from 'react-bootstrap';
import type { LicenseTypeManagementDto } from '@/types/lookup';

interface ApproveLicenseTypeModalProps {
	show: boolean;
	onHide: () => void;
	licenseType: LicenseTypeManagementDto | null;
	onApprove: (id: number, isApproved: boolean, rejectionReason?: string) => Promise<void>;
}

const ApproveLicenseTypeModal: React.FC<ApproveLicenseTypeModalProps> = ({ 
	show, 
	onHide, 
	licenseType, 
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
		
		if (!licenseType || !action) return;
		
		if (action === 'reject' && !rejectionReason.trim()) {
			setError('Rejection reason is required');
			return;
		}

		setLoading(true);
		setError('');
		
		try {
			await onApprove(
				licenseType.id, 
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

	if (!licenseType) return null;

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton={!loading}>
					<Modal.Title>
						{action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Review'} License Type
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="mb-3">
						<div className="d-flex align-items-center gap-2">
							<strong>License Type:</strong> 
							<span>{licenseType.name}</span>
							<Badge bg="info" className="font-monospace">{licenseType.code}</Badge>
						</div>
					</div>
					{licenseType.isStateSpecific && (
						<div className="mb-3">
							<Badge bg="warning" text="dark">
								<i className="mdi mdi-map-marker-outline me-1"></i>
								State-Specific
							</Badge>
						</div>
					)}
					{licenseType.description && (
						<div className="mb-3 text-muted">
							<small>{licenseType.description}</small>
						</div>
					)}
					{licenseType.usageCount > 0 && (
						<div className="mb-3">
							<small className="text-muted">
								Used in {licenseType.usageCount} profession type{licenseType.usageCount > 1 ? 's' : ''}
							</small>
						</div>
					)}
					{licenseType.createdByUserName && (
						<div className="mb-3">
							<small className="text-muted">
								Created by: <strong>{licenseType.createdByUserName}</strong>
								<br />
								Created at: {new Date(licenseType.createdAt).toLocaleDateString()}
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
								Approve License Type
							</Button>
							<Button 
								variant="danger" 
								onClick={() => setAction('reject')}
								disabled={loading}
							>
								<i className="mdi mdi-close-circle me-1"></i>
								Reject License Type
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
							This license type will be approved and made available for all users.
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

export default ApproveLicenseTypeModal;
