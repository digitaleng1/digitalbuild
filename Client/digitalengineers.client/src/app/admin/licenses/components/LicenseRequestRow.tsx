import React, { useCallback, useState } from 'react';
import { Badge, Button, Form } from 'react-bootstrap';
import { useToast } from '@/contexts';
import licenseRequestService from '@/services/licenseRequestService';
import { getErrorMessage } from '@/common/helpers/errorUtils';
import type { LicenseRequest } from '@/types/licenseRequest';

interface LicenseRequestRowProps {
	license: LicenseRequest;
	onViewDetails: (license: LicenseRequest) => void;
	onActionSuccess: () => void;
}

const LicenseRequestRow = React.memo<LicenseRequestRowProps>(
	({ license, onViewDetails, onActionSuccess }) => {
		const { showSuccess, showError } = useToast();
		const [showApproveInput, setShowApproveInput] = useState(false);
		const [showRejectInput, setShowRejectInput] = useState(false);
		const [approveComment, setApproveComment] = useState('');
		const [rejectReason, setRejectReason] = useState('');
		const [isSubmitting, setIsSubmitting] = useState(false);

		const handleApprove = useCallback(async () => {
			if (!showApproveInput) {
				setShowApproveInput(true);
				return;
			}

			try {
				setIsSubmitting(true);
				
				const requestData = {
					specialistId: license.specialistId,
					licenseTypeId: license.licenseTypeId,
					adminComment: approveComment || undefined,
				};
				
				console.log('Sending approve request with data:', requestData);
				
				await licenseRequestService.approveLicenseRequest(license.id, requestData);
				
				showSuccess('Success', 'License request approved successfully');
				setShowApproveInput(false);
				setApproveComment('');
				onActionSuccess();
			} catch (error) {
				showError('Error', getErrorMessage(error));
			} finally {
				setIsSubmitting(false);
			}
		}, [
			showApproveInput,
			approveComment,
			license,
			showSuccess,
			showError,
			onActionSuccess,
		]);

		const handleReject = useCallback(async () => {
			if (!showRejectInput) {
				setShowRejectInput(true);
				return;
			}

			if (!rejectReason.trim()) {
				showError('Validation Error', 'Rejection reason is required');
				return;
			}

			try {
				setIsSubmitting(true);
				
				const requestData = {
					specialistId: license.specialistId,
					licenseTypeId: license.licenseTypeId,
					adminComment: rejectReason,
				};
				
				console.log('Sending reject request with data:', requestData);
				
				await licenseRequestService.rejectLicenseRequest(license.id, requestData);
				
				showSuccess('Success', 'License request rejected');
				setShowRejectInput(false);
				setRejectReason('');
				onActionSuccess();
			} catch (error) {
				showError('Error', getErrorMessage(error));
			} finally {
				setIsSubmitting(false);
			}
		}, [
			showRejectInput,
			rejectReason,
			license,
			showSuccess,
			showError,
			onActionSuccess,
		]);

		const handleCancelApprove = useCallback(() => {
			setShowApproveInput(false);
			setApproveComment('');
		}, []);

		const handleCancelReject = useCallback(() => {
			setShowRejectInput(false);
			setRejectReason('');
		}, []);

		const formatDate = useCallback((dateString: string) => {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		}, []);

		return (
			<tr>
				<td>
					<div className="d-flex align-items-center">
						<div className="avatar-sm me-2">
							<div className="avatar-title bg-soft-primary text-primary rounded-circle">
								{license.specialistName.charAt(0)}
							</div>
						</div>
						<div>
							<h5 className="mb-0 font-14">{license.specialistName}</h5>
							<p className="mb-0 text-muted font-13">{license.specialistEmail}</p>
						</div>
					</div>
				</td>
				<td>
					<span className="font-14">{license.licenseTypeName}</span>
				</td>
				<td>
					<Badge bg="info" className="font-13">
						{license.state}
					</Badge>
				</td>
				<td>
					<span className="text-muted font-13">{formatDate(license.createdAt)}</span>
				</td>
				<td className="text-end">
					<div className="d-flex justify-content-end align-items-center gap-1">
						{!showApproveInput && !showRejectInput && (
							<>
								<Button
									variant="light"
									size="sm"
									onClick={() => onViewDetails(license)}
									disabled={isSubmitting}
									title="View Details"
								>
									<i className="uil uil-eye" />
								</Button>

								<Button
									variant="success"
									size="sm"
									onClick={handleApprove}
									disabled={isSubmitting}
									title="Approve"
								>
									<i className="uil uil-check" />
								</Button>

								<Button
									variant="danger"
									size="sm"
									onClick={handleReject}
									disabled={isSubmitting}
									title="Reject"
								>
									<i className="uil uil-times" />
								</Button>
							</>
						)}

						{showApproveInput && (
							<div className="d-flex align-items-center gap-1">
								<Form.Control
									type="text"
									size="sm"
									placeholder="Comment (optional)"
									value={approveComment}
									onChange={(e) => setApproveComment(e.target.value)}
									style={{ minWidth: '200px' }}
									disabled={isSubmitting}
								/>
								<Button
									variant="success"
									size="sm"
									onClick={handleApprove}
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<span className="spinner-border spinner-border-sm" />
									) : (
										<i className="uil uil-check" />
									)}
								</Button>
								<Button
									variant="light"
									size="sm"
									onClick={handleCancelApprove}
									disabled={isSubmitting}
								>
									<i className="uil uil-times" />
								</Button>
							</div>
						)}

						{showRejectInput && (
							<div className="d-flex align-items-center gap-1">
								<Form.Control
									type="text"
									size="sm"
									placeholder="Reason (required)"
									value={rejectReason}
									onChange={(e) => setRejectReason(e.target.value)}
									style={{ minWidth: '200px' }}
									disabled={isSubmitting}
								/>
								<Button
									variant="danger"
									size="sm"
									onClick={handleReject}
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<span className="spinner-border spinner-border-sm" />
									) : (
										<i className="uil uil-check" />
									)}
								</Button>
								<Button
									variant="light"
									size="sm"
									onClick={handleCancelReject}
									disabled={isSubmitting}
								>
									<i className="uil uil-times" />
								</Button>
							</div>
						)}
					</div>
				</td>
			</tr>
		);
	}
);

LicenseRequestRow.displayName = 'LicenseRequestRow';

export default LicenseRequestRow;
