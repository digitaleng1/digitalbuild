import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import type { ProfessionManagementDto, CreateProfessionTypeDto, ProfessionTypeManagementDto } from '@/types/lookup';

interface AddProfessionTypeModalProps {
	show: boolean;
	onHide: () => void;
	profession: ProfessionManagementDto | null;
	onCreate: (dto: CreateProfessionTypeDto) => Promise<ProfessionTypeManagementDto>;
}

const AddProfessionTypeModal: React.FC<AddProfessionTypeModalProps> = ({ 
	show, 
	onHide, 
	profession, 
	onCreate 
}) => {
	const [formData, setFormData] = useState<CreateProfessionTypeDto>({
		name: '',
		code: '',
		description: '',
		professionId: 0,
		requiresStateLicense: false,
		displayOrder: 0,
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (profession) {
			setFormData(prev => ({
				...prev,
				professionId: profession.id,
				name: '',
				code: '',
				description: '',
				requiresStateLicense: false,
				displayOrder: 0,
			}));
		}
	}, [profession]);

	const handleClose = () => {
		if (!loading) {
			setErrors({});
			setFormData({
				name: '',
				code: '',
				description: '',
				professionId: 0,
				requiresStateLicense: false,
				displayOrder: 0,
			});
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
			await onCreate(formData);
			handleClose();
		} catch (err) {
			setErrors({ submit: 'Failed to create profession type' });
		} finally {
			setLoading(false);
		}
	};

	if (!profession) return null;

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton={!loading}>
					<Modal.Title>Add Profession Type</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="alert alert-info mb-3">
						<i className="mdi mdi-information-outline me-1"></i>
						Adding type to: <strong>{profession.name}</strong> [{profession.code}]
					</div>

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
							placeholder="E.g., Structural Engineering"
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
							placeholder="E.g., A-02, STRUCT"
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
							placeholder="Enter profession type description"
						/>
						<Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
						<Form.Text className="text-muted">
							{formData.description?.length || 0}/500 characters
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Check
							type="switch"
							id="requiresStateLicense"
							label="Requires State License"
							checked={formData.requiresStateLicense}
							onChange={(e) => setFormData({ ...formData, requiresStateLicense: e.target.checked })}
							disabled={loading}
						/>
						<Form.Text className="text-muted">
							Enable if this profession type requires state-issued licenses
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
							Order in which this type appears in lists
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
								Creating...
							</>
						) : (
							<>
								<i className="mdi mdi-plus me-1"></i>
								Create Type
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default AddProfessionTypeModal;
