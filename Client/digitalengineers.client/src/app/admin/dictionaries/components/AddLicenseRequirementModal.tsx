import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import type { 
	ProfessionTypeManagementDto, 
	LicenseTypeManagementDto, 
	CreateLicenseRequirementDto, 
	LicenseRequirement 
} from '@/types/lookup';

interface AddLicenseRequirementModalProps {
	show: boolean;
	onHide: () => void;
	professionType: ProfessionTypeManagementDto | null;
	licenseTypes: LicenseTypeManagementDto[];
	existingRequirements: LicenseRequirement[];
	onCreate: (professionTypeId: number, dto: CreateLicenseRequirementDto) => Promise<LicenseRequirement>;
}

const AddLicenseRequirementModal: React.FC<AddLicenseRequirementModalProps> = ({ 
	show, 
	onHide, 
	professionType, 
	licenseTypes,
	existingRequirements,
	onCreate 
}) => {
	const [formData, setFormData] = useState<Omit<CreateLicenseRequirementDto, 'professionTypeId'>>({
		licenseTypeId: 0,
		isRequired: true,
		notes: '',
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const availableLicenseTypes = useMemo(() => {
		const existingIds = new Set(existingRequirements.map(r => r.licenseTypeId));
		return licenseTypes.filter(lt => lt.isApproved && !existingIds.has(lt.id));
	}, [licenseTypes, existingRequirements]);

	useEffect(() => {
		if (show) {
			setFormData({
				licenseTypeId: 0,
				isRequired: true,
				notes: '',
			});
			setErrors({});
		}
	}, [show]);

	const handleClose = () => {
		if (!loading) {
			setErrors({});
			onHide();
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.licenseTypeId || formData.licenseTypeId === 0) {
			newErrors.licenseTypeId = 'License type is required';
		}

		if (formData.notes && formData.notes.length > 500) {
			newErrors.notes = 'Notes must be less than 500 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!professionType || !validateForm()) return;

		setLoading(true);
		
		try {
			await onCreate(professionType.id, {
				...formData,
				professionTypeId: professionType.id,
			});
			handleClose();
		} catch (err) {
			setErrors({ submit: 'Failed to add license requirement' });
		} finally {
			setLoading(false);
		}
	};

	if (!professionType) return null;

	const selectedLicenseType = licenseTypes.find(lt => lt.id === formData.licenseTypeId);

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton={!loading}>
					<Modal.Title>Add License Requirement</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="alert alert-info mb-3">
						<i className="mdi mdi-information-outline me-1"></i>
						Adding requirement to: <strong>{professionType.name}</strong> [{professionType.code}]
					</div>

					<Form.Group className="mb-3">
						<Form.Label>
							License Type <span className="text-danger">*</span>
						</Form.Label>
						<Form.Select
							value={formData.licenseTypeId}
							onChange={(e) => setFormData({ ...formData, licenseTypeId: parseInt(e.target.value) })}
							isInvalid={!!errors.licenseTypeId}
							disabled={loading}
						>
							<option value="">Select license type...</option>
							{availableLicenseTypes.map((lt) => (
								<option key={lt.id} value={lt.id}>
									{lt.code} — {lt.name} {lt.isStateSpecific ? '(State-Specific)' : ''}
								</option>
							))}
						</Form.Select>
						<Form.Control.Feedback type="invalid">{errors.licenseTypeId}</Form.Control.Feedback>
						{availableLicenseTypes.length === 0 && (
							<Form.Text className="text-warning">
								<i className="mdi mdi-alert-outline me-1"></i>
								No available license types. All approved types are already assigned.
							</Form.Text>
						)}
					</Form.Group>

					{selectedLicenseType && (
						<div className="alert alert-secondary mb-3">
							<small>
								<strong>{selectedLicenseType.name}</strong>
								{selectedLicenseType.description && (
									<p className="mb-0 mt-1 text-muted">{selectedLicenseType.description}</p>
								)}
								{selectedLicenseType.isStateSpecific && (
									<span className="badge bg-warning text-dark mt-2">State-Specific</span>
								)}
							</small>
						</div>
					)}

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
							rows={2}
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
					<Button 
						variant="primary" 
						type="submit" 
						disabled={loading || availableLicenseTypes.length === 0}
					>
						{loading ? (
							<>
								<Spinner as="span" animation="border" size="sm" className="me-2" />
								Adding...
							</>
						) : (
							<>
								<i className="mdi mdi-plus me-1"></i>
								Add Requirement
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default AddLicenseRequirementModal;
