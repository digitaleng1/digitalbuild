import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardBody, Form } from 'react-bootstrap';
import type { ClientProfile } from '@/types/client';
import { useUpdateClient } from '@/app/shared/hooks/useUpdateClient';

interface ContactInfoProps {
	profile: ClientProfile;
	onRefresh: () => void;
}

const ContactInfo = React.memo(({ profile, onRefresh }: ContactInfoProps) => {
	const { updateClient, loading: updating } = useUpdateClient();
	const [isEditMode, setIsEditMode] = useState(false);
	const [editedProfile, setEditedProfile] = useState(profile);

	const handleChange = useCallback((field: string, value: any) => {
		setEditedProfile((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSave = useCallback(async () => {
		await updateClient({
			firstName: editedProfile.firstName,
			lastName: editedProfile.lastName,
			companyName: editedProfile.companyName,
			industry: editedProfile.industry,
			website: editedProfile.website,
			companyDescription: editedProfile.companyDescription,
			phoneNumber: editedProfile.phoneNumber,
			location: editedProfile.location,
		});

		setIsEditMode(false);
		onRefresh();
	}, [editedProfile, updateClient, onRefresh]);

	const handleCancel = useCallback(() => {
		setEditedProfile(profile);
		setIsEditMode(false);
	}, [profile]);

	const currentProfile = useMemo(() => (isEditMode ? editedProfile : profile), [isEditMode, editedProfile, profile]);

	return (
		<Card>
			<CardBody>
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h4 className="header-title mb-0">Contact Information</h4>
					<div className="d-flex gap-2">
						{isEditMode ? (
							<>
								<i
									className="mdi mdi-close text-danger cursor-pointer"
									style={{ fontSize: '1.2rem' }}
									onClick={handleCancel}
									title="Cancel"
								></i>
								{updating ? (
									<span className="spinner-border spinner-border-sm text-primary"></span>
								) : (
									<i
										className="mdi mdi-content-save text-success cursor-pointer"
										style={{ fontSize: '1.2rem' }}
										onClick={handleSave}
										title="Save"
									></i>
								)}
							</>
						) : (
							<i
								className="mdi mdi-pencil text-primary cursor-pointer"
								style={{ fontSize: '1.2rem' }}
								onClick={() => setIsEditMode(true)}
								title="Edit"
							></i>
						)}
					</div>
				</div>

				<Form>
					<Form.Group className="mb-3">
						<Form.Label>
							<i className="mdi mdi-email-outline me-2"></i>Email
						</Form.Label>
						<p className="text-muted mb-0">{currentProfile.email}</p>
						<small className="text-muted">Email cannot be changed</small>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							<i className="mdi mdi-phone-outline me-2"></i>Phone Number
						</Form.Label>
						{isEditMode ? (
							<Form.Control
								type="tel"
								value={currentProfile.phoneNumber || ''}
								onChange={(e) => handleChange('phoneNumber', e.target.value)}
								placeholder="Enter phone number"
								maxLength={20}
							/>
						) : (
							<p className="text-muted mb-0">{currentProfile.phoneNumber || 'Not specified'}</p>
						)}
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							<i className="mdi mdi-map-marker-outline me-2"></i>Location
						</Form.Label>
						{isEditMode ? (
							<Form.Control
								type="text"
								value={currentProfile.location || ''}
								onChange={(e) => handleChange('location', e.target.value)}
								placeholder="City, Country"
								maxLength={100}
							/>
						) : (
							<p className="text-muted mb-0">{currentProfile.location || 'Not specified'}</p>
						)}
					</Form.Group>
				</Form>
			</CardBody>
		</Card>
	);
});

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo;
