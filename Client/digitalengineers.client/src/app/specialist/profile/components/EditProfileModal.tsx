import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useUpdateSpecialist } from '@/app/shared/hooks/useUpdateSpecialist';
import { useLicenseTypes } from '@/app/shared/hooks/useLicenseTypes';
import type { SpecialistProfile, UpdateSpecialistDto } from '@/types/specialist';

interface EditProfileModalProps {
	show: boolean;
	profile: SpecialistProfile;
	onHide: () => void;
	onSuccess: () => void;
}

const EditProfileModal = ({ show, profile, onHide, onSuccess }: EditProfileModalProps) => {
	const { updateSpecialist, loading: updating } = useUpdateSpecialist();
	const { licenseTypes, loading: loadingLicenses } = useLicenseTypes();
	
	const [formData, setFormData] = useState<UpdateSpecialistDto>({
		yearsOfExperience: profile.yearsOfExperience,
		hourlyRate: profile.hourlyRate,
		specialization: profile.specialization || '',
		isAvailable: profile.isAvailable,
		licenseTypeIds: profile.licenseTypeIds,
	});
	
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (show) {
			setFormData({
				yearsOfExperience: profile.yearsOfExperience,
				hourlyRate: profile.hourlyRate,
				specialization: profile.specialization || '',
				isAvailable: profile.isAvailable,
				licenseTypeIds: profile.licenseTypeIds,
			});
			setErrors({});
		}
	}, [show, profile]);

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 100) {
			newErrors.yearsOfExperience = 'Years of experience must be between 0 and 100';
		}

		if (formData.hourlyRate !== undefined && formData.hourlyRate < 0) {
			newErrors.hourlyRate = 'Hourly rate must be positive';
		}

		if (formData.licenseTypeIds.length === 0) {
			newErrors.licenseTypeIds = 'At least one license type is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLicenseTypeToggle = (licenseTypeId: number) => {
		setFormData((prev) => ({
			...prev,
			licenseTypeIds: prev.licenseTypeIds.includes(licenseTypeId)
				? prev.licenseTypeIds.filter((id) => id !== licenseTypeId)
				: [...prev.licenseTypeIds, licenseTypeId],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			await updateSpecialist(profile.id, formData);
			onSuccess();
			onHide();
		} catch (error) {
			// Error handled by hook
		}
	};

	const handleClose = () => {
		if (!updating) {
			onHide();
		}
	};

	const isLoading = updating || loadingLicenses;

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton={!updating}>
				<Modal.Title>Edit Profile</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>
									Years of Experience <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="number"
									min={0}
									max={100}
									value={formData.yearsOfExperience}
									onChange={(e) =>
										setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })
									}
									isInvalid={!!errors.yearsOfExperience}
									disabled={isLoading}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.yearsOfExperience}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Hourly Rate ($/hr)</Form.Label>
								<Form.Control
									type="number"
									min={0}
									step={0.01}
									value={formData.hourlyRate || ''}
									onChange={(e) =>
										setFormData({
											...formData,
											hourlyRate: e.target.value ? parseFloat(e.target.value) : undefined,
										})
									}
									isInvalid={!!errors.hourlyRate}
									disabled={isLoading}
									placeholder="Optional"
								/>
								<Form.Control.Feedback type="invalid">{errors.hourlyRate}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-3">
						<Form.Label>Specialization</Form.Label>
						<Form.Control
							type="text"
							value={formData.specialization}
							onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
							disabled={isLoading}
							maxLength={500}
							placeholder="e.g., Structural Engineering, Civil Engineering"
						/>
						<Form.Text className="text-muted">Optional</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							License Types <span className="text-danger">*</span>
						</Form.Label>
						{loadingLicenses ? (
							<div className="text-center py-3">
								<Spinner animation="border" size="sm" />
								<p className="text-muted mt-2">Loading license types...</p>
							</div>
						) : (
							<div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
								<Row>
									{licenseTypes.map((licenseType) => (
										<Col md={6} key={licenseType.id} className="mb-2">
											<Form.Check
												type="checkbox"
												id={`license-${licenseType.id}`}
												label={licenseType.name}
												checked={formData.licenseTypeIds.includes(licenseType.id)}
												onChange={() => handleLicenseTypeToggle(licenseType.id)}
												disabled={isLoading}
											/>
										</Col>
									))}
								</Row>
							</div>
						)}
						{errors.licenseTypeIds && (
							<Alert variant="danger" className="mt-2 mb-0">
								{errors.licenseTypeIds}
							</Alert>
						)}
					</Form.Group>

					<Form.Group className="mb-0">
						<Form.Check
							type="checkbox"
							id="isAvailable"
							label="Available for work"
							checked={formData.isAvailable}
							onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
							disabled={isLoading}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={updating}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" disabled={isLoading}>
						{updating ? (
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

export default EditProfileModal;
