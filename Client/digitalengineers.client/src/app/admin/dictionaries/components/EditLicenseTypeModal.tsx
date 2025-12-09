import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import type { LicenseTypeManagementDto, UpdateLicenseTypeDto, ProfessionManagementDto } from '@/types/lookup';

interface EditLicenseTypeModalProps {
	show: boolean;
	onHide: () => void;
	licenseType: LicenseTypeManagementDto | null;
	professions: ProfessionManagementDto[];
	onUpdate: (id: number, dto: UpdateLicenseTypeDto) => Promise<LicenseTypeManagementDto>;
}

const EditLicenseTypeModal: React.FC<EditLicenseTypeModalProps> = ({ 
	show, 
	onHide, 
	licenseType, 
	professions,
	onUpdate 
}) => {
	const [formData, setFormData] = useState<UpdateLicenseTypeDto>({
		name: '',
		description: '',
		professionId: 0,
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (licenseType) {
			setFormData({
				name: licenseType.name,
				description: licenseType.description,
				professionId: licenseType.professionId,
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

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
		} else if (formData.description.length > 500) {
			newErrors.description = 'Description must be less than 500 characters';
		}

		if (!formData.professionId || formData.professionId === 0) {
			newErrors.professionId = 'Profession is required';
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
							Profession <span className="text-danger">*</span>
						</Form.Label>
						<Form.Select
							value={formData.professionId}
							onChange={(e) => setFormData({ ...formData, professionId: parseInt(e.target.value) })}
							isInvalid={!!errors.professionId}
							disabled={loading}
						>
							<option value="">Select profession...</option>
							{professions.filter(p => p.isApproved).map((prof) => (
								<option key={prof.id} value={prof.id}>
									{prof.name}
								</option>
							))}
						</Form.Select>
						<Form.Control.Feedback type="invalid">{errors.professionId}</Form.Control.Feedback>
					</Form.Group>

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
							Description <span className="text-danger">*</span>
						</Form.Label>
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
							{formData.description.length}/500 characters
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

export default EditLicenseTypeModal;
