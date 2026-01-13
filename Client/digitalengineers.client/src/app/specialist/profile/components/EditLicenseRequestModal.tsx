import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import licenseRequestService from '@/services/licenseRequestService';
import lookupService from '@/services/lookupService';
import type { LicenseRequest, ResubmitLicenseRequest } from '@/types/licenseRequest';
import type { State } from '@/types/lookup';

interface EditLicenseRequestModalProps {
	show: boolean;
	onHide: () => void;
	onSuccess: () => void;
	licenseRequest: LicenseRequest;
}

const EditLicenseRequestModal = ({ show, onHide, onSuccess, licenseRequest }: EditLicenseRequestModalProps) => {
	const { showSuccess, showError } = useToast();
	
	const [states, setStates] = useState<State[]>([]);
	const [statesLoading, setStatesLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [formData, setFormData] = useState<Partial<ResubmitLicenseRequest>>({
		state: '',
		issuingAuthority: '',
		issueDate: '',
		expirationDate: '',
		licenseNumber: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (show) {
			fetchStates();
			// Pre-fill form with existing data
			setFormData({
				state: licenseRequest.state,
				issuingAuthority: licenseRequest.issuingAuthority,
				issueDate: licenseRequest.issueDate.split('T')[0],
				expirationDate: licenseRequest.expirationDate.split('T')[0],
				licenseNumber: licenseRequest.licenseNumber,
			});
			setFile(null);
			setErrors({});
		}
	}, [show, licenseRequest]);

	const fetchStates = async () => {
		try {
			setStatesLoading(true);
			const data = await lookupService.getStates();
			setStates(data);
		} catch (error) {
			showError('Error', 'Failed to load states');
		} finally {
			setStatesLoading(false);
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.state?.trim()) {
			newErrors.state = 'State is required';
		}

		if (!formData.issuingAuthority?.trim()) {
			newErrors.issuingAuthority = 'Issuing authority is required';
		}

		if (!formData.issueDate) {
			newErrors.issueDate = 'Issue date is required';
		}

		if (!formData.expirationDate) {
			newErrors.expirationDate = 'Expiration date is required';
		}

		if (!formData.licenseNumber?.trim()) {
			newErrors.licenseNumber = 'License number is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			const requestData: ResubmitLicenseRequest = {
				state: formData.state!,
				issuingAuthority: formData.issuingAuthority!,
				issueDate: formData.issueDate!,
				expirationDate: formData.expirationDate!,
				licenseNumber: formData.licenseNumber!,
				file: file || undefined,
			};

			await licenseRequestService.resubmitLicenseRequest(
				licenseRequest.specialistId,
				licenseRequest.licenseTypeId,
				licenseRequest.professionTypeId,
				requestData
			);
			showSuccess('Success', 'License request resubmitted successfully. Awaiting admin verification.');
			onSuccess();
		} catch (error: any) {
			showError('Error', error.response?.data?.message || 'Failed to resubmit license request');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		if (!loading) {
			onHide();
		}
	};

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>Edit & Resubmit License Request</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
					{licenseRequest.adminComment && (
						<Alert variant="danger" className="mb-3">
							<i className="mdi mdi-alert-circle-outline me-2"></i>
							<strong>Rejection Reason:</strong> {licenseRequest.adminComment}
						</Alert>
					)}

					<Alert variant="info" className="mb-3">
						<i className="mdi mdi-information-outline me-2"></i>
						Update the information below and resubmit for verification.
					</Alert>

					<div className="mb-3 p-3 border rounded bg-light">
						<strong>License Type:</strong> {licenseRequest.licenseTypeName}
					</div>

					<Form.Group className="mb-3">
						<Form.Label>
							State <span className="text-danger">*</span>
						</Form.Label>
						<Form.Select
							value={formData.state || ''}
							onChange={(e) => setFormData({ ...formData, state: e.target.value })}
							isInvalid={!!errors.state}
							disabled={loading || statesLoading}
						>
							<option value="">Select state...</option>
							{states.map((state) => (
								<option key={state.value} value={state.value}>
									{state.label}
								</option>
							))}
						</Form.Select>
						<Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							Issuing Authority <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							placeholder="e.g., NCEES, State Board of Engineering"
							value={formData.issuingAuthority || ''}
							onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
							isInvalid={!!errors.issuingAuthority}
							disabled={loading}
							maxLength={200}
						/>
						<Form.Control.Feedback type="invalid">{errors.issuingAuthority}</Form.Control.Feedback>
					</Form.Group>

					<div className="row">
						<div className="col-md-6">
							<Form.Group className="mb-3">
								<Form.Label>
									Issue Date <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="date"
									value={formData.issueDate || ''}
									onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
									isInvalid={!!errors.issueDate}
									disabled={loading}
								/>
								<Form.Control.Feedback type="invalid">{errors.issueDate}</Form.Control.Feedback>
							</Form.Group>
						</div>
						<div className="col-md-6">
							<Form.Group className="mb-3">
								<Form.Label>
									Expiration Date <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="date"
									value={formData.expirationDate || ''}
									onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
									isInvalid={!!errors.expirationDate}
									disabled={loading}
								/>
								<Form.Control.Feedback type="invalid">{errors.expirationDate}</Form.Control.Feedback>
							</Form.Group>
						</div>
					</div>

					<Form.Group className="mb-3">
						<Form.Label>
							License Number <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter license number"
							value={formData.licenseNumber || ''}
							onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
							isInvalid={!!errors.licenseNumber}
							disabled={loading}
							maxLength={100}
						/>
						<Form.Control.Feedback type="invalid">{errors.licenseNumber}</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Upload New License Document (Optional)</Form.Label>
						<Form.Control
							type="file"
							accept=".pdf,.jpg,.jpeg,.png"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
							disabled={loading}
						/>
						<Form.Text className="text-muted">
							Accepted formats: PDF, JPG, PNG (Max 10MB). Leave empty to keep current file.
						</Form.Text>
					</Form.Group>

					{licenseRequest.licenseFileUrl && !file && (
						<Alert variant="secondary" className="mb-0">
							<i className="mdi mdi-file-document-outline me-2"></i>
							Current file will be kept if no new file is uploaded.
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" disabled={loading}>
						{loading ? (
							<>
								<Spinner as="span" animation="border" size="sm" className="me-2" />
								Resubmitting...
							</>
						) : (
							<>
								<i className="mdi mdi-send me-1"></i>
								Resubmit for Verification
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditLicenseRequestModal;
