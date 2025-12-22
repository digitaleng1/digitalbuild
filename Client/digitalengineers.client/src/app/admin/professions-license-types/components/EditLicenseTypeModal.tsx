import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import type { LicenseTypeManagementDto, UpdateLicenseTypeDto } from '@/types/lookup';

interface EditLicenseTypeModalProps {
	show: boolean;
	onHide: () => void;
	licenseType: LicenseTypeManagementDto | null;
	onUpdate: (id: number, dto: UpdateLicenseTypeDto) => Promise<LicenseTypeManagementDto>;
}

const EditLicenseTypeModal: React.FC<EditLicenseTypeModalProps> = ({ 
	show, 
	onHide, 
	licenseType, 
	onUpdate 
}) => {
	const [formData, setFormData] = useState<UpdateLicenseTypeDto>({
		name: '',
		code: '',
		description: '',
		isStateSpecific: false,
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (licenseType) {
			setFormData({
				name: licenseType.name,
				code: licenseType.code,
				description: licenseType.description,
				isStateSpecific: licenseType.isStateSpecific,
			});
		}
	}, [licenseType]);

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
		
		if (!licenseType || !validateForm()) return;

		setLoading(true);
		
		try {
			await onUpdate(licenseType.id, formData);
			handleClose();
		} catch (err) {
			setErrors({ submit: 'Failed to update license type' });
		} finally {
			setLoading(false);
		}
	};

	if (!licenseType) return null;

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton={!loading}>
					<Modal.Title>Edit License Type</Modal.Title>
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
							placeholder="Enter license type name"
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
							placeholder="E.g., PE, SE, RA"
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
							placeholder="Enter license type description"
						/>
						<Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
						<Form.Text className="text-muted">
							{formData.description?.length || 0}/500 characters
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Check
							type="switch"
							id="isStateSpecific"
							label="State-Specific License"
							checked={formData.isStateSpecific}
							onChange={(e) => setFormData({ ...formData, isStateSpecific: e.target.checked })}
							disabled={loading}
						/>
						<Form.Text className="text-muted">
							Enable if this license varies by state
						</Form.Text>
					</Form.Group>

					{licenseType.usageCount > 0 && (
						<div className="alert alert-info">
							<i className="mdi mdi-information-outline me-1"></i>
							This license type is used in {licenseType.usageCount} profession type{licenseType.usageCount > 1 ? 's' : ''}.
						</div>
					)}

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

export default EditLicenseTypeModal;
