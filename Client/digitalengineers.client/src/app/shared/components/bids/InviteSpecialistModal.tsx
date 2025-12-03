import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import type { LicenseType } from '@/types/project';
import type { InviteSpecialistDto, InviteSpecialistResult } from '@/types/specialist-invitation';
import specialistInvitationService from '@/services/specialistInvitationService';
import { useToast } from '@/contexts/ToastContext';

interface InviteSpecialistModalProps {
	show: boolean;
	onHide: () => void;
	licenseType: LicenseType;
	onInvitationSent: (result: InviteSpecialistResult) => void;
}

const DEFAULT_MESSAGE = `Welcome to Digital Engineers! We're excited to have you join our platform. 
You'll be working on projects that require your expertise and skills. 
Please use the credentials below to log in and get started.`;

const InviteSpecialistModal: React.FC<InviteSpecialistModalProps> = ({ show, onHide, licenseType, onInvitationSent }) => {
	const { showSuccess, showError } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
	const [formData, setFormData] = useState<InviteSpecialistDto>({
		email: '',
		firstName: '',
		lastName: '',
		customMessage: DEFAULT_MESSAGE,
		licenseTypeId: licenseType.id,
	});

	const handleChange = useCallback((field: keyof InviteSpecialistDto, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			//debugger;
			if (!formData.email || !formData.firstName || !formData.lastName) {
				showError('Validation Error', 'Please fill in all required fields');
				return;
			}

			try {
				setIsSubmitting(true);
				const result = await specialistInvitationService.inviteSpecialist(formData);
				setGeneratedPassword(result.generatedPassword);
				showSuccess('Success', `Invitation sent to ${result.email}`);

				// Auto-close after 3 seconds
				setTimeout(() => {
					onInvitationSent(result);
					onHide();
					resetForm();
				}, 3000);
			} catch (error: any) {
				showError('Invitation error', error);
			} finally {
				setIsSubmitting(false);
			}
		},
		[formData, showSuccess, showError, onInvitationSent, onHide]
	);

	const resetForm = useCallback(() => {
		setFormData({
			email: '',
			firstName: '',
			lastName: '',
			customMessage: DEFAULT_MESSAGE,
			licenseTypeId: licenseType.id,
		});
		setGeneratedPassword(null);
	}, [licenseType.id]);

	const handleClose = useCallback(() => {
		resetForm();
		onHide();
	}, [resetForm, onHide]);

	const isFormValid = useMemo(() => {
		return formData.email && formData.firstName && formData.lastName;
	}, [formData.email, formData.firstName, formData.lastName]);

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>Invite New Specialist</Modal.Title>
			</Modal.Header>

			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Alert variant="info" className="mb-3">
						<i className="mdi mdi-information me-2"></i>
						User will be created with <strong>{licenseType.name}</strong> license
					</Alert>

					{generatedPassword && (
						<Alert variant="success" className="mb-3">
							<i className="mdi mdi-check-circle me-2"></i>
							<strong>Invitation sent successfully!</strong>
							<br />
							Generated password: <strong>{generatedPassword}</strong>
							<br />
							<small className="text-muted">Closing in 3 seconds...</small>
						</Alert>
					)}

					<Form.Group className="mb-3">
						<Form.Label>
							Email <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="email"
							placeholder="specialist@example.com"
							value={formData.email}
							onChange={(e) => handleChange('email', e.target.value)}
							disabled={isSubmitting}
							required
						/>
					</Form.Group>

					<div className="row">
						<div className="col-md-6">
							<Form.Group className="mb-3">
								<Form.Label>
									First Name <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="John"
									value={formData.firstName}
									onChange={(e) => handleChange('firstName', e.target.value)}
									disabled={isSubmitting}
									required
								/>
							</Form.Group>
						</div>
						<div className="col-md-6">
							<Form.Group className="mb-3">
								<Form.Label>
									Last Name <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Doe"
									value={formData.lastName}
									onChange={(e) => handleChange('lastName', e.target.value)}
									disabled={isSubmitting}
									required
								/>
							</Form.Group>
						</div>
					</div>

					<Form.Group className="mb-3">
						<Form.Label>Custom Message (Optional)</Form.Label>
						<Form.Control
							as="textarea"
							rows={4}
							placeholder="Enter a custom message for the invitation email..."
							value={formData.customMessage || ''}
							onChange={(e) => handleChange('customMessage', e.target.value)}
							disabled={isSubmitting}
						/>
						<Form.Text className="text-muted">
							This message will be included in the invitation email along with login credentials.
						</Form.Text>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="light" onClick={handleClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" disabled={isSubmitting || !isFormValid}>
						{isSubmitting ? (
							<>
								<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
								Sending...
							</>
						) : (
							<>
								<i className="mdi mdi-send me-1"></i>
								Send Invitation
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default React.memo(InviteSpecialistModal);
