import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import type { ProfessionManagementDto, UpdateProfessionDto } from '@/types/lookup';

interface EditProfessionModalProps {
	show: boolean;
	onHide: () => void;
	profession: ProfessionManagementDto | null;
	onUpdate: (id: number, dto: UpdateProfessionDto) => Promise<ProfessionManagementDto>;
}

const EditProfessionModal: React.FC<EditProfessionModalProps> = ({ 
	show, 
	onHide, 
	profession, 
	onUpdate 
}) => {
	const [formData, setFormData] = useState<UpdateProfessionDto>({
		name: '',
		code: '',
		description: '',
		displayOrder: 0,
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (profession) {
			setFormData({
				name: profession.name,
				code: profession.code,
				description: profession.description,
				displayOrder: profession.displayOrder,
			});
		}
	}, [profession]);

	const handleClose = () => {
		if (!loading) {
			setErrors({});
			onHide();
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
		} else if (formData.name.length > 100) {
			newErrors.name = 'Name must be less than 100 characters';
		}

		if (!formData.code.trim()) {
			newErrors.code = 'Code is required';
		} else if (formData.code.length > 20) {
			newErrors.code = 'Code must be less than 20 characters';
		} else if (!/^[A-Z0-9_-]+$/i.test(formData.code)) {
			newErrors.code = 'Code can only contain letters, numbers, hyphens and underscores';
		}

		if (formData.description && formData.description.length > 500) {
			newErrors.description = 'Description must be less than 500 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!profession || !validateForm()) return;

		setLoading(true);
		
		try {
			await onUpdate(profession.id, formData);
			handleClose();
		} catch (err) {
			setErrors({ submit: 'Failed to update profession' });
		} finally {
			setLoading(false);
		}
	};

	if (!profession) return null;

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton={!loading}>
					<Modal.Title>Edit Profession</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>
							Name <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							isInvalid={!!errors.name}
							disabled={loading}
							maxLength={100}
							placeholder="Enter profession name"
						/>
						<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							Code <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							value={formData.code}
							onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
							isInvalid={!!errors.code}
							disabled={loading}
							maxLength={20}
							placeholder="E.g., ENG, ARCH, ELEC"
							className="font-monospace"
						/>
						<Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
						<Form.Text className="text-muted">
							Unique identifier code (uppercase letters, numbers, hyphens)
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							isInvalid={!!errors.description}
							disabled={loading}
							maxLength={500}
							placeholder="Enter profession description"
						/>
						<Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
						<Form.Text className="text-muted">
							{formData.description?.length || 0}/500 characters
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Display Order</Form.Label>
						<Form.Control
							type="number"
							value={formData.displayOrder}
							onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
							disabled={loading}
							min={0}
						/>
						<Form.Text className="text-muted">
							Order in which this profession appears in lists
						</Form.Text>
					</Form.Group>

					{errors.submit && (
						<div className="alert alert-danger">
							{errors.submit}
						</div>
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
								Saving...
							</>
						) : (
							<>
								<i className="mdi mdi-content-save me-1"></i>
								Save Changes
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditProfessionModal;
