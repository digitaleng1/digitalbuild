import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Badge } from 'react-bootstrap';
import type { LicenseRequirement, UpdateLicenseRequirementDto, ProfessionTypeManagementDto } from '@/types/lookup';

interface EditLicenseRequirementModalProps {
	show: boolean;
	onHide: () => void;
	professionType: ProfessionTypeManagementDto | null;
	requirement: LicenseRequirement | null;
	onUpdate: (id: number, professionTypeId: number, dto: UpdateLicenseRequirementDto) => Promise<LicenseRequirement>;
}

const EditLicenseRequirementModal: React.FC<EditLicenseRequirementModalProps> = ({ 
	show, 
	onHide, 
	professionType,
	requirement, 
	onUpdate 
}) => {
	const [formData, setFormData] = useState<UpdateLicenseRequirementDto>({
		isRequired: true,
		notes: '',
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (requirement) {
			setFormData({
				isRequired: requirement.isRequired,
				notes: requirement.notes || '',
			});
		}
	}, [requirement]);

	const handleClose = () => {
		if (!loading) {
			setErrors({});
			onHide();
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (formData.notes && formData.notes.length > 500) {
			newErrors.notes = 'Notes must be less than 500 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!requirement || !professionType || !validateForm()) return;

		setLoading(true);
		
		try {
			await onUpdate(requirement.id, professionType.id, formData);
			handleClose();
		} catch (err) {
			setErrors({ submit: 'Failed to update license requirement' });
		} finally {
			setLoading(false);
		}
	};

	if (!requirement || !professionType) return null;

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton={!loading}>
					<Modal.Title>Edit License Requirement</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="alert alert-secondary mb-3">
						<small>
							<strong>Profession Type:</strong> {professionType.name} [{professionType.code}]
						</small>
					</div>

					<div className="mb-3 p-3 border rounded bg-light">
						<div className="d-flex align-items-center mb-2">
							<i className="mdi mdi-certificate-outline text-primary me-2"></i>
							<strong>{requirement.licenseTypeCode}</strong>
							<span className="mx-2">—</span>
							<span>{requirement.licenseTypeName}</span>
						</div>
						{requirement.isStateSpecific && (
							<Badge bg="warning" text="dark">
								<i className="mdi mdi-map-marker-outline me-1"></i>
								State-Specific
							</Badge>
						)}
					</div>

					<Form.Group className="mb-3">
						<Form.Check
							type="switch"
							id="isRequired"
							label="Required License"
							checked={formData.isRequired}
							onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
							disabled={loading}
						/>
						<Form.Text className="text-muted">
							{formData.isRequired 
								? 'This license is mandatory for the profession type' 
								: 'This license is optional/recommended'}
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Notes</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={formData.notes || ''}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
							isInvalid={!!errors.notes}
							disabled={loading}
							maxLength={500}
							placeholder="Additional notes about this requirement..."
						/>
						<Form.Control.Feedback type="invalid">{errors.notes}</Form.Control.Feedback>
						<Form.Text className="text-muted">
							{formData.notes?.length || 0}/500 characters
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

export default EditLicenseRequirementModal;
