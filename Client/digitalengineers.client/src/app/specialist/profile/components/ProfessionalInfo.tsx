import { Card, CardBody } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { SpecialistProfile } from '@/types/specialist';

interface ProfessionalInfoProps {
	profile: SpecialistProfile;
}

const ProfessionalInfo = ({ profile }: ProfessionalInfoProps) => {
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
					<p className="mb-0">{profile.yearsOfExperience} years</p>
				</div>

				{profile.hourlyRate && (
					<div className="mb-3">
						<h6 className="text-muted mb-1">Hourly Rate</h6>
						<p className="mb-0">${profile.hourlyRate}/hr</p>
					</div>
				)}

				<div className="mb-3">
					<h6 className="text-muted mb-1">Availability</h6>
					<p className="mb-0">
						{profile.isAvailable ? (
							<span className="badge bg-success">Available for work</span>
						) : (
							<span className="badge bg-danger">Not available</span>
						)}
					</p>
				</div>

				{profile.specialization && (
					<div className="mb-3">
						<h6 className="text-muted mb-1">Specialization</h6>
						<p className="mb-0">{profile.specialization}</p>
					</div>
				)}

				{profile.location && (
					<div className="mb-3">
						<h6 className="text-muted mb-1">Location</h6>
						<p className="mb-0">
							<i className="mdi mdi-map-marker me-1"></i>
							{profile.location}
						</p>
					</div>
				)}

				{profile.biography && (
					<div className="mb-3">
						<h6 className="text-muted mb-1">About</h6>
						<p className="mb-0">{profile.biography}</p>
					</div>
				)}

				{profile.website && (
					<div className="mb-0">
						<h6 className="text-muted mb-1">Website</h6>
						<p className="mb-0">
							<a href={profile.website} target="_blank" rel="noopener noreferrer">
								<i className="mdi mdi-web me-1"></i>
								{profile.website}
							</a>
						</p>
					</div>
				)}
			</CardBody>
		</Card>
	);
};

export default ProfessionalInfo;
