import { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useToast } from '@/contexts';
import lookupService from '@/services/lookupService';
import type { CreateLicenseTypeDto, LicenseTypeViewModel, Profession } from '@/types/lookup';

interface CreateLicenseTypeModalProps {
	show: boolean;
	onHide: () => void;
	profession: Profession;
	onSuccess: (newLicenseType: LicenseTypeViewModel) => void;
}

const CreateLicenseTypeModal = ({ show, onHide, profession, onSuccess }: CreateLicenseTypeModalProps) => {
	const { showSuccess, showError } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<CreateLicenseTypeDto>({
		name: '',
		description: '',
		professionId: profession.id,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'License type name is required';
		} else if (formData.name.length > 100) {
			newErrors.name = 'License type name must not exceed 100 characters';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
		} else if (formData.description.length > 500) {
			newErrors.description = 'Description must not exceed 500 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleInputChange = useCallback((field: keyof CreateLicenseTypeDto, value: string | number) => {
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
				`Your license type has been created successfully and is now available for selection under ${profession.name}.`
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
	}, [formData, validateForm, profession.name, showSuccess, showError, onSuccess, onHide]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}, [handleSubmit]);

	const resetForm = useCallback(() => {
		setFormData({ 
			name: '', 
			description: '', 
			professionId: profession.id 
		});
		setErrors({});
	}, [profession.id]);

	const handleClose = useCallback(() => {
		if (!loading) {
			resetForm();
			onHide();
		}
	}, [loading, resetForm, onHide]);

	const isFormValid = useMemo(() => {
		return formData.name.trim() !== '' && formData.description.trim() !== '';
	}, [formData]);

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>Create New License Type for {profession.name}</Modal.Title>
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

				<Alert variant="secondary" className="mb-0">
					<strong>Profession:</strong> {profession.name}
				</Alert>
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
