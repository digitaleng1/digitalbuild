import { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useToast } from '@/contexts';
import lookupService from '@/services/lookupService';
import type { CreateProfessionDto, ProfessionViewModel } from '@/types/lookup';

interface CreateProfessionModalProps {
	show: boolean;
	onHide: () => void;
	onSuccess: (newProfession: ProfessionViewModel) => void;
}

const CreateProfessionModal = ({ show, onHide, onSuccess }: CreateProfessionModalProps) => {
	const { showSuccess, showError } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<CreateProfessionDto>({
		name: '',
		description: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Profession name is required';
		} else if (formData.name.length > 100) {
			newErrors.name = 'Profession name must not exceed 100 characters';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
		} else if (formData.description.length > 500) {
			newErrors.description = 'Description must not exceed 500 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleInputChange = useCallback((field: keyof CreateProfessionDto, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: '' }));
	}, []);

	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			const result = await lookupService.createProfession(formData);
			
			showSuccess(
				'Profession Created',
				'Your profession has been created successfully and is now available for selection.'
			);
			
			onSuccess(result);
			resetForm();
			onHide();
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Failed to create profession';
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
		setFormData({ name: '', description: '' });
		setErrors({});
	}, []);

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
				<Modal.Title>Create New Profession</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className="mb-3">
					<Form.Label>
						Profession Name <span className="text-danger">*</span>
					</Form.Label>
					<Form.Control
						type="text"
						placeholder="e.g., Structural Engineer, Architect"
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
						placeholder="Describe the profession and its responsibilities..."
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
							Create Profession
						</>
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateProfessionModal;
