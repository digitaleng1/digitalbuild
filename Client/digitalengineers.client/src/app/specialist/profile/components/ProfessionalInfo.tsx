import { useState } from 'react';
import { Card, CardBody, Form } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { SpecialistProfile } from '@/types/specialist';
import { useUpdateSpecialist } from '@/app/shared/hooks/useUpdateSpecialist';

interface ProfessionalInfoProps {
	profile: SpecialistProfile;
	onRefresh: () => void;
}

const ProfessionalInfo = ({ profile, onRefresh }: ProfessionalInfoProps) => {
	const { updateSpecialist, loading: updating } = useUpdateSpecialist();
	const [isEditMode, setIsEditMode] = useState(false);
	const [editedProfile, setEditedProfile] = useState(profile);

	const handleChange = (field: string, value: any) => {
		setEditedProfile({ ...editedProfile, [field]: value });
	};

	const handleSave = async () => {
		await updateSpecialist(profile.id, {
			firstName: editedProfile.firstName,
			lastName: editedProfile.lastName,
			biography: editedProfile.biography,
			location: editedProfile.location,
			website: editedProfile.website,
			specialization: editedProfile.specialization,
			yearsOfExperience: editedProfile.yearsOfExperience,
			hourlyRate: editedProfile.hourlyRate,
			isAvailable: editedProfile.isAvailable,
			licenseTypeIds: editedProfile.licenseTypeIds,
		});
		setIsEditMode(false);
		onRefresh();
	};

	const handleCancel = () => {
		setEditedProfile(profile);
		setIsEditMode(false);
	};

	const currentProfile = isEditMode ? editedProfile : profile;

	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Professional Information"
					icon="mdi mdi-account-details"
				>
					{isEditMode ? (
						<div className="d-flex gap-2">
							<i 
								className="mdi mdi-close text-muted cursor-pointer"
								style={{ fontSize: '1.3rem' }}
								onClick={handleCancel}
								title="Cancel"
							></i>
							{updating ? (
								<span className="spinner-border spinner-border-sm text-muted"></span>
							) : (
								<i 
									className="mdi mdi-content-save text-muted cursor-pointer"
									style={{ fontSize: '1.3rem' }}
									onClick={handleSave}
									title="Save"
								></i>
							)}
						</div>
					) : (
						<i 
							className="mdi mdi-pencil text-muted cursor-pointer"
							style={{ fontSize: '1.3rem' }}
							onClick={() => setIsEditMode(true)}
							title="Edit"
						></i>
					)}
				</CardTitle>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Experience</h6>
					{isEditMode ? (
						<Form.Control
							type="number"
							value={currentProfile.yearsOfExperience}
							onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value) || 0)}
							min={0}
							max={50}
						/>
					) : (
						<p className="mb-0">{currentProfile.yearsOfExperience} years</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Hourly Rate</h6>
					{isEditMode ? (
						<Form.Control
							type="number"
							value={currentProfile.hourlyRate || ''}
							onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || undefined)}
							placeholder="Enter hourly rate"
							min={0}
							step={0.01}
						/>
					) : (
						<p className="mb-0">{currentProfile.hourlyRate ? `$${currentProfile.hourlyRate}/hr` : 'Not specified'}</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Availability</h6>
					{isEditMode ? (
						<Form.Check
							type="switch"
							id="availability-switch"
							label={currentProfile.isAvailable ? 'Available for work' : 'Not available'}
							checked={currentProfile.isAvailable}
							onChange={(e) => handleChange('isAvailable', e.target.checked)}
						/>
					) : (
						<p className="mb-0">
							{currentProfile.isAvailable ? (
								<span className="badge bg-success">Available for work</span>
							) : (
								<span className="badge bg-danger">Not available</span>
							)}
						</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Specialization</h6>
					{isEditMode ? (
						<Form.Control
							type="text"
							value={currentProfile.specialization || ''}
							onChange={(e) => handleChange('specialization', e.target.value)}
							placeholder="Enter specialization"
						/>
					) : (
						<p className="mb-0">{currentProfile.specialization || 'Not specified'}</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Location</h6>
					{isEditMode ? (
						<Form.Control
							type="text"
							value={currentProfile.location || ''}
							onChange={(e) => handleChange('location', e.target.value)}
							placeholder="Enter location"
						/>
					) : (
						<p className="mb-0">
							{currentProfile.location ? (
								<>
									<i className="mdi mdi-map-marker me-1"></i>
									{currentProfile.location}
								</>
							) : (
								'Not specified'
							)}
						</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">About</h6>
					{isEditMode ? (
						<Form.Control
							as="textarea"
							rows={4}
							value={currentProfile.biography || ''}
							onChange={(e) => handleChange('biography', e.target.value)}
							placeholder="Tell us about yourself"
						/>
					) : (
						<p className="mb-0">{currentProfile.biography || 'No biography provided'}</p>
					)}
				</div>

				<div className="mb-0">
					<h6 className="text-muted mb-1">Website</h6>
					{isEditMode ? (
						<Form.Control
							type="url"
							value={currentProfile.website || ''}
							onChange={(e) => handleChange('website', e.target.value)}
							placeholder="https://example.com"
						/>
					) : (
						<p className="mb-0">
							{currentProfile.website ? (
								<a href={currentProfile.website} target="_blank" rel="noopener noreferrer">
									<i className="mdi mdi-web me-1"></i>
									{currentProfile.website}
								</a>
							) : (
								'Not specified'
							)}
						</p>
					)}
				</div>
			</CardBody>
		</Card>
	);
};

export default ProfessionalInfo;
