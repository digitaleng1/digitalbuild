import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import type { ProfessionType } from '@/types/lookup';
import type { InviteSpecialistDto, InviteSpecialistResult } from '@/types/specialist-invitation';
import specialistInvitationService from '@/services/specialistInvitationService';
import { useToast } from '@/contexts/ToastContext';

interface InviteSpecialistModalProps {
	show: boolean;
	onHide: () => void;
	professionTypes: ProfessionType[];
	onInvitationSent: (result: InviteSpecialistResult) => void;
}

const DEFAULT_MESSAGE = `Welcome toNovobid! We're excited to have you join our platform. 
You'll be working on projects that require your expertise and skills. 
Please use the credentials below to log in and get started.`;

const InviteSpecialistModal: React.FC<InviteSpecialistModalProps> = ({ show, onHide, professionTypes, onInvitationSent }) => {
	const { showSuccess, showError } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
	const [selectedProfessionTypeIds, setSelectedProfessionTypeIds] = useState<Set<number>>(new Set());
	const [formData, setFormData] = useState<Omit<InviteSpecialistDto, 'professionTypeIds'>>({
		email: '',
		firstName: '',
		lastName: '',
		customMessage: DEFAULT_MESSAGE,
	});

	const handleChange = useCallback((field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleProfessionTypeToggle = useCallback((professionTypeId: number) => {
		setSelectedProfessionTypeIds((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(professionTypeId)) {
				newSet.delete(professionTypeId);
			} else {
				newSet.add(professionTypeId);
			}
			return newSet;
		});
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (!formData.email || !formData.firstName || !formData.lastName) {
				showError('Validation Error', 'Please fill in all required fields');
				return;
			}

			if (selectedProfessionTypeIds.size === 0) {
				showError('Validation Error', 'Please select at least one profession type');
				return;
			}

			try {
				setIsSubmitting(true);
				const result = await specialistInvitationService.inviteSpecialist({
					...formData,
					professionTypeIds: Array.from(selectedProfessionTypeIds),
				});
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
		[formData, selectedProfessionTypeIds, showSuccess, showError, onInvitationSent, onHide]
	);

	const resetForm = useCallback(() => {
		setFormData({
			email: '',
			firstName: '',
			lastName: '',
			customMessage: DEFAULT_MESSAGE,
		});
		setSelectedProfessionTypeIds(new Set());
		setGeneratedPassword(null);
	}, []);

	const handleClose = useCallback(() => {
		resetForm();
		onHide();
	}, [resetForm, onHide]);

	const isFormValid = useMemo(() => {
		return formData.email && formData.firstName && formData.lastName && selectedProfessionTypeIds.size > 0;
	}, [formData.email, formData.firstName, formData.lastName, selectedProfessionTypeIds]);

	const selectedProfessionTypesDisplay = useMemo(() => {
		return professionTypes.filter((pt) => selectedProfessionTypeIds.has(pt.id));
	}, [professionTypes, selectedProfessionTypeIds]);

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>Invite New Specialist</Modal.Title>
			</Modal.Header>

			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					{selectedProfessionTypesDisplay.length > 0 && (
						<Alert variant="info" className="mb-3">
							<i className="mdi mdi-information me-2"></i>
							User will be created with expertise in: <strong>{selectedProfessionTypesDisplay.map(pt => pt.name).join(', ')}</strong>
						</Alert>
					)}

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
						<Form.Label>
							Profession Types <span className="text-danger">*</span>
						</Form.Label>
						<div className="d-flex flex-column gap-2">
							{professionTypes.map((pt) => (
								<Form.Check
									key={pt.id}
									type="switch"
									id={`profession-type-switch-${pt.id}`}
									label={pt.name}
									checked={selectedProfessionTypeIds.has(pt.id)}
									onChange={() => handleProfessionTypeToggle(pt.id)}
									disabled={isSubmitting}
									className="user-select-none"
								/>
							))}
						</div>
						<Form.Text className="text-muted">
							Select at least one profession type. Required licenses will be automatically added.
						</Form.Text>
					</Form.Group>

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
