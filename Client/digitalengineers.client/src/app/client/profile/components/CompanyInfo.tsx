import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardBody, Form } from 'react-bootstrap';
import type { ClientProfile } from '@/types/client';
import { useUpdateClient } from '@/app/shared/hooks/useUpdateClient';

interface CompanyInfoProps {
	profile: ClientProfile;
	onRefresh: () => void;
}

const industries = ['Construction', 'Real Estate', 'Manufacturing', 'Engineering', 'Architecture', 'Other'];

const CompanyInfo = React.memo(({ profile, onRefresh }: CompanyInfoProps) => {
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
					<h4 className="header-title mb-0">Company Information</h4>
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
						<Form.Label>Company Name</Form.Label>
						{isEditMode ? (
							<Form.Control
								type="text"
								value={currentProfile.companyName || ''}
								onChange={(e) => handleChange('companyName', e.target.value)}
								placeholder="Enter company name"
								maxLength={100}
							/>
						) : (
							<p className="text-muted mb-0">{currentProfile.companyName || 'Not specified'}</p>
						)}
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Industry</Form.Label>
						{isEditMode ? (
							<Form.Select
								value={currentProfile.industry || ''}
								onChange={(e) => handleChange('industry', e.target.value)}
							>
								<option value="">Select industry</option>
								{industries.map((industry) => (
									<option key={industry} value={industry}>
										{industry}
									</option>
								))}
							</Form.Select>
						) : (
							<p className="text-muted mb-0">{currentProfile.industry || 'Not specified'}</p>
						)}
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Website</Form.Label>
						{isEditMode ? (
							<Form.Control
								type="url"
								value={currentProfile.website || ''}
								onChange={(e) => handleChange('website', e.target.value)}
								placeholder="https://example.com"
								maxLength={200}
							/>
						) : currentProfile.website ? (
							<p className="mb-0">
								<a href={currentProfile.website} target="_blank" rel="noopener noreferrer">
									{currentProfile.website}
								</a>
							</p>
						) : (
							<p className="text-muted mb-0">Not specified</p>
						)}
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Company Description</Form.Label>
						{isEditMode ? (
							<Form.Control
								as="textarea"
								rows={3}
								value={currentProfile.companyDescription || ''}
								onChange={(e) => handleChange('companyDescription', e.target.value)}
								placeholder="Tell us about your company..."
								maxLength={500}
							/>
						) : (
							<p className="text-muted mb-0">{currentProfile.companyDescription || 'Not specified'}</p>
						)}
					</Form.Group>
				</Form>
			</CardBody>
		</Card>
	);
});

CompanyInfo.displayName = 'CompanyInfo';

export default CompanyInfo;
