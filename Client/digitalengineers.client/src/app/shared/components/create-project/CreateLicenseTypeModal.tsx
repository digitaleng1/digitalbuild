import { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useToast } from '@/contexts';
import lookupService from '@/services/lookupService';
import type { CreateLicenseTypeDto, LicenseTypeViewModel } from '@/types/lookup';

interface CreateLicenseTypeModalProps {
	show: boolean;
	onHide: () => void;
	onSuccess: (newLicenseType: LicenseTypeViewModel) => void;
}

const CreateLicenseTypeModal = ({ show, onHide, onSuccess }: CreateLicenseTypeModalProps) => {
	const { showSuccess, showError } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<CreateLicenseTypeDto>({
		name: '',
		code: '',
		description: '',
		isStateSpecific: false,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'License type name is required';
		} else if (formData.name.length > 100) {
			newErrors.name = 'License type name must not exceed 100 characters';
		}

		if (!formData.code.trim()) {
			newErrors.code = 'Code is required';
		} else if (formData.code.length > 20) {
			newErrors.code = 'Code must not exceed 20 characters';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
		} else if (formData.description.length > 500) {
			newErrors.description = 'Description must not exceed 500 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleInputChange = useCallback((field: keyof CreateLicenseTypeDto, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: '' }));
	}, []);

	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			const result = await lookupService.createLicenseType(formData);
			
			showSuccess(
				'License Type Created',
				'Your license type has been created successfully and is now available for selection.'
			);
			
			onSuccess(result);
			resetForm();
			onHide();
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Failed to create license type';
			showError('Error', errorMessage);
		} finally {
			setLoading(false);
		}
	}, [formData, validateForm, showSuccess, showError, onSuccess, onHide]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}, [handleSubmit]);

	const resetForm = useCallback(() => {
		setFormData({ 
			name: '', 
			code: '',
			description: '', 
			isStateSpecific: false 
		});
		setErrors({});
	}, []);

	const handleClose = useCallback(() => {
		if (!loading) {
			resetForm();
			onHide();
		}
	}, [loading, resetForm, onHide]);

	const isFormValid = useMemo(() => {
		return formData.name.trim() !== '' && 
		       formData.code.trim() !== '' && 
		       formData.description.trim() !== '';
	}, [formData]);

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>Create New License Type</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className="mb-3">
					<Form.Label>
						License Type Name <span className="text-danger">*</span>
					</Form.Label>
					<Form.Control
						type="text"
						placeholder="e.g., Professional Engineer (PE), Registered Architect (RA)"
						value={formData.name}
						onChange={(e) => handleInputChange('name', e.target.value)}
						onKeyDown={handleKeyDown}
						isInvalid={!!errors.name}
						disabled={loading}
						maxLength={100}
					/>
					<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
					<Form.Text className="text-muted">
						{formData.name.length}/100 characters
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>
						Code <span className="text-danger">*</span>
					</Form.Label>
					<Form.Control
						type="text"
						placeholder="e.g., PE, RA, EIT"
						value={formData.code}
						onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
						onKeyDown={handleKeyDown}
						isInvalid={!!errors.code}
						disabled={loading}
						maxLength={20}
					/>
					<Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
					<Form.Text className="text-muted">
						Unique code for this license type (will be uppercase)
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>
						Description <span className="text-danger">*</span>
					</Form.Label>
					<Form.Control
						as="textarea"
						rows={4}
						placeholder="Describe the license type and its requirements..."
						value={formData.description}
						onChange={(e) => handleInputChange('description', e.target.value)}
						isInvalid={!!errors.description}
						disabled={loading}
						maxLength={500}
					/>
					<Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
					<Form.Text className="text-muted">
						{formData.description.length}/500 characters
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Check
						type="checkbox"
						id="isStateSpecific"
						label="State Specific License"
						checked={formData.isStateSpecific}
						onChange={(e) => handleInputChange('isStateSpecific', e.target.checked)}
						disabled={loading}
					/>
					<Form.Text className="text-muted">
						Check if this license type requires separate licenses for each state
					</Form.Text>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose} disabled={loading}>
					Cancel
				</Button>
				<Button variant="primary" onClick={handleSubmit} disabled={!isFormValid || loading}>
					{loading ? (
						<>
							<Spinner as="span" animation="border" size="sm" className="me-2" />
							Submitting...
						</>
					) : (
						<>
							<i className="mdi mdi-plus me-1"></i>
							Create License Type
						</>
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateLicenseTypeModal;
