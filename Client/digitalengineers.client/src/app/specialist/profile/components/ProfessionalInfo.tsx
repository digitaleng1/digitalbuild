import { Card, CardBody, Form } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { SpecialistProfile } from '@/types/specialist';

interface ProfessionalInfoProps {
	profile: SpecialistProfile;
	isEditMode: boolean;
	onProfileChange: (profile: SpecialistProfile) => void;
}

const ProfessionalInfo = ({ profile, isEditMode, onProfileChange }: ProfessionalInfoProps) => {
	const handleChange = (field: string, value: any) => {
		onProfileChange({ ...profile, [field]: value });
	};

	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Professional Information"
					icon="mdi mdi-account-details"
				/>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Experience</h6>
					{isEditMode ? (
						<Form.Control
							type="number"
							value={profile.yearsOfExperience}
							onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value) || 0)}
							min={0}
							max={50}
						/>
					) : (
						<p className="mb-0">{profile.yearsOfExperience} years</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Hourly Rate</h6>
					{isEditMode ? (
						<Form.Control
							type="number"
							value={profile.hourlyRate || ''}
							onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || undefined)}
							placeholder="Enter hourly rate"
							min={0}
							step={0.01}
						/>
					) : (
						<p className="mb-0">{profile.hourlyRate ? `$${profile.hourlyRate}/hr` : 'Not specified'}</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Availability</h6>
					{isEditMode ? (
						<Form.Check
							type="switch"
							id="availability-switch"
							label={profile.isAvailable ? 'Available for work' : 'Not available'}
							checked={profile.isAvailable}
							onChange={(e) => handleChange('isAvailable', e.target.checked)}
						/>
					) : (
						<p className="mb-0">
							{profile.isAvailable ? (
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
							value={profile.specialization || ''}
							onChange={(e) => handleChange('specialization', e.target.value)}
							placeholder="Enter specialization"
						/>
					) : (
						<p className="mb-0">{profile.specialization || 'Not specified'}</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Location</h6>
					{isEditMode ? (
						<Form.Control
							type="text"
							value={profile.location || ''}
							onChange={(e) => handleChange('location', e.target.value)}
							placeholder="Enter location"
						/>
					) : (
						<p className="mb-0">
							{profile.location ? (
								<>
									<i className="mdi mdi-map-marker me-1"></i>
									{profile.location}
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
							value={profile.biography || ''}
							onChange={(e) => handleChange('biography', e.target.value)}
							placeholder="Tell us about yourself"
						/>
					) : (
						<p className="mb-0">{profile.biography || 'No biography provided'}</p>
					)}
				</div>

				<div className="mb-0">
					<h6 className="text-muted mb-1">Website</h6>
					{isEditMode ? (
						<Form.Control
							type="url"
							value={profile.website || ''}
							onChange={(e) => handleChange('website', e.target.value)}
							placeholder="https://example.com"
						/>
					) : (
						<p className="mb-0">
							{profile.website ? (
								<a href={profile.website} target="_blank" rel="noopener noreferrer">
									<i className="mdi mdi-web me-1"></i>
									{profile.website}
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
