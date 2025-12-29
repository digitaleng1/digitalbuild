import React, { useCallback, useState } from 'react';
import { Badge, Button, Form, Modal } from 'react-bootstrap';
import { useToast } from '@/contexts';
import licenseRequestService from '@/services/licenseRequestService';
import { getErrorMessage } from '@/common/helpers/errorUtils';
import type { LicenseRequest } from '@/types/licenseRequest';

interface LicenseDetailsModalProps {
	show: boolean;
	license: LicenseRequest;
	onClose: () => void;
	onActionSuccess: () => void;
}

const LicenseDetailsModal = React.memo<LicenseDetailsModalProps>(
	({ show, license, onClose, onActionSuccess }) => {
		const { showSuccess, showError } = useToast();
		const [approveComment, setApproveComment] = useState('');
		const [rejectReason, setRejectReason] = useState('');
		const [isSubmitting, setIsSubmitting] = useState(false);

		const formatDate = useCallback((dateString: string) => {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		}, []);

		const handleApprove = useCallback(async () => {
			try {
				setIsSubmitting(true);
				await licenseRequestService.approveLicenseRequest(license.id, {
					specialistId: license.specialistId,
					licenseTypeId: license.licenseTypeId,
					adminComment: approveComment || undefined,
				});
				showSuccess('Success', 'License request approved successfully');
				setApproveComment('');
				onActionSuccess();
				onClose();
			} catch (error) {
				showError('Error', getErrorMessage(error));
			} finally {
				setIsSubmitting(false);
			}
		}, [approveComment, license, showSuccess, showError, onActionSuccess, onClose]);

		const handleReject = useCallback(async () => {
			if (!rejectReason.trim()) {
				showError('Validation Error', 'Rejection reason is required');
				return;
			}

			try {
				setIsSubmitting(true);
				await licenseRequestService.rejectLicenseRequest(license.id, {
					specialistId: license.specialistId,
					licenseTypeId: license.licenseTypeId,
					adminComment: rejectReason,
				});
				showSuccess('Success', 'License request rejected');
				setRejectReason('');
				onActionSuccess();
				onClose();
			} catch (error) {
				showError('Error', getErrorMessage(error));
			} finally {
				setIsSubmitting(false);
			}
		}, [rejectReason, license, showSuccess, showError, onActionSuccess, onClose]);

		const handleDownload = useCallback(() => {
			if (license.licenseFileUrl) {
				window.open(license.licenseFileUrl, '_blank');
			}
		}, [license.licenseFileUrl]);

		return (
			<Modal show={show} onHide={onClose} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>License Request Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="mb-4">
						<h5 className="mb-3">Specialist Information</h5>
						<div className="d-flex align-items-center mb-3">
							<div className="avatar-lg me-3">
								<div className="avatar-title bg-soft-primary text-primary rounded-circle font-20">
									{license.specialistName.charAt(0)}
								</div>
							</div>
							<div>
								<h5 className="mb-0">{license.specialistName}</h5>
								<p className="mb-0 text-muted">{license.specialistEmail}</p>
							</div>
						</div>
					</div>

					<div className="mb-4">
						<h5 className="mb-3">License Information</h5>
						<div className="row g-3">
							<div className="col-md-6">
								<label className="form-label text-muted">License Type</label>
								<p className="mb-0 font-16 fw-semibold">{license.licenseTypeName}</p>
							</div>
							<div className="col-md-6">
								<label className="form-label text-muted">State</label>
								<p className="mb-0">
									<Badge bg="info" className="font-14">
										{license.state}
									</Badge>
								</p>
							</div>
							<div className="col-md-6">
								<label className="form-label text-muted">Issuing Authority</label>
								<p className="mb-0">{license.issuingAuthority}</p>
							</div>
							<div className="col-md-6">
								<label className="form-label text-muted">License Number</label>
								<p className="mb-0 font-14 fw-semibold">{license.licenseNumber}</p>
							</div>
							<div className="col-md-6">
								<label className="form-label text-muted">Issue Date</label>
								<p className="mb-0">{formatDate(license.issueDate)}</p>
							</div>
							<div className="col-md-6">
								<label className="form-label text-muted">Expiration Date</label>
								<p className="mb-0">{formatDate(license.expirationDate)}</p>
							</div>
						</div>
					</div>

					{license.licenseFileUrl && (
						<div className="mb-4">
							<h5 className="mb-3">License File</h5>
							<Button variant="outline-primary" size="sm" onClick={handleDownload}>
								<i className="uil uil-download-alt me-1" />
								Download License File
							</Button>
						</div>
					)}

					<div className="mb-3">
						<h5 className="mb-3">Admin Review</h5>
						<Form.Group className="mb-3">
							<Form.Label>Comment (Optional)</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Add any comments about this license..."
								value={approveComment}
								onChange={(e) => setApproveComment(e.target.value)}
								disabled={isSubmitting}
							/>
							<Form.Text className="text-muted">
								This comment will be sent to the specialist via email
							</Form.Text>
						</Form.Group>
					</div>

					<div className="mb-3">
						<Form.Group>
							<Form.Label>
								Rejection Reason <span className="text-danger">*</span>
							</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Provide a reason for rejection (required)..."
								value={rejectReason}
								onChange={(e) => setRejectReason(e.target.value)}
								disabled={isSubmitting}
							/>
							<Form.Text className="text-muted">
								This reason will be sent to the specialist via email
							</Form.Text>
						</Form.Group>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="light" onClick={onClose} disabled={isSubmitting}>
						Close
					</Button>
					<Button
						variant="danger"
						onClick={handleReject}
						disabled={isSubmitting || !rejectReason.trim()}
					>
						{isSubmitting ? (
							<>
								<span className="spinner-border spinner-border-sm me-1" />
								Rejecting...
							</>
						) : (
							<>
								<i className="uil uil-times me-1" />
								Reject
							</>
						)}
					</Button>
					<Button variant="success" onClick={handleApprove} disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<span className="spinner-border spinner-border-sm me-1" />
								Approving...
							</>
						) : (
							<>
								<i className="uil uil-check me-1" />
								Approve
							</>
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
);

LicenseDetailsModal.displayName = 'LicenseDetailsModal';

export default LicenseDetailsModal;
