import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import licenseRequestService from '@/services/licenseRequestService';
import lookupService from '@/services/lookupService';
import { useLicenseTypes } from '@/app/shared/hooks/useLicenseTypes';
import type { CreateLicenseRequest } from '@/types/licenseRequest';
import type { State } from '@/types/lookup';

interface AddLicenseRequestModalProps {
	show: boolean;
	onHide: () => void;
	onSuccess: () => void;
}

const AddLicenseRequestModal = ({ show, onHide, onSuccess }: AddLicenseRequestModalProps) => {
	const { showSuccess, showError } = useToast();
	const { licenseTypes, loading: licenseTypesLoading } = useLicenseTypes();
	const [states, setStates] = useState<State[]>([]);
	const [statesLoading, setStatesLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [formData, setFormData] = useState<Partial<CreateLicenseRequest>>({
		licenseTypeId: 0,
		state: '',
		issuingAuthority: '',
		issueDate: '',
		expirationDate: '',
		licenseNumber: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
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

		if (show) {
			fetchStates();
		}
	}, [show, showError]);

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.licenseTypeId || formData.licenseTypeId === 0) {
			newErrors.licenseTypeId = 'License type is required';
		}

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

		if (!file) {
			newErrors.file = 'License file is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm() || !file) {
			return;
		}

		setLoading(true);
		try {
			const requestData: CreateLicenseRequest = {
				licenseTypeId: formData.licenseTypeId!,
				state: formData.state!,
				issuingAuthority: formData.issuingAuthority!,
				issueDate: formData.issueDate!,
				expirationDate: formData.expirationDate!,
				licenseNumber: formData.licenseNumber!,
				file: file,
			};

			await licenseRequestService.createLicenseRequest(requestData);
			showSuccess('Success', 'License request submitted successfully. Awaiting admin verification.');
			onSuccess();
			resetForm();
		} catch (error: any) {
			showError('Error', error.response?.data?.message || 'Failed to submit license request');
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			licenseTypeId: 0,
			state: '',
			issuingAuthority: '',
			issueDate: '',
			expirationDate: '',
			licenseNumber: '',
		});
		setFile(null);
		setErrors({});
	};

	const handleClose = () => {
		if (!loading) {
			resetForm();
			onHide();
		}
	};

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>Add Professional License</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Alert variant="info" className="mb-3">
						<i className="mdi mdi-information-outline me-2"></i>
						Your license will be verified by an administrator before being added to your profile.
					</Alert>

					<Form.Group className="mb-3">
						<Form.Label>
							License Type <span className="text-danger">*</span>
						</Form.Label>
						<Form.Select
							value={formData.licenseTypeId || ''}
							onChange={(e) => setFormData({ ...formData, licenseTypeId: parseInt(e.target.value) })}
							isInvalid={!!errors.licenseTypeId}
							disabled={loading || licenseTypesLoading}
						>
							<option value="">Select license type...</option>
							{licenseTypes.map((lt) => (
								<option key={lt.id} value={lt.id}>
									{lt.name}
								</option>
							))}
						</Form.Select>
						<Form.Control.Feedback type="invalid">{errors.licenseTypeId}</Form.Control.Feedback>
					</Form.Group>

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
						<Form.Label>
							Upload License Document <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="file"
							accept=".pdf,.jpg,.jpeg,.png"
							onChange={(e: any) => setFile(e.target.files?.[0] || null)}
							isInvalid={!!errors.file}
							disabled={loading}
						/>
						<Form.Text className="text-muted">
							Accepted formats: PDF, JPG, PNG (Max 10MB)
						</Form.Text>
						<Form.Control.Feedback type="invalid">{errors.file}</Form.Control.Feedback>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" disabled={loading}>
						{loading ? (
							<>
								<Spinner as="span" animation="border" size="sm" className="me-2" />
								Submitting...
							</>
						) : (
							<>
								<i className="mdi mdi-send me-1"></i>
								Submit for Verification
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default AddLicenseRequestModal;
