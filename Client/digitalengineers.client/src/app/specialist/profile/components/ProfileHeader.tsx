import { Card, CardBody, Form } from 'react-bootstrap';
import type { SpecialistProfile } from '@/types/specialist';
import Rating from '@/components/Rating';
import avatarImg from '@/assets/images/users/avatar-1.jpg';

interface ProfileHeaderProps {
	profile: SpecialistProfile;
	isEditMode: boolean;
	onEditToggle: () => void;
	onProfileChange: (profile: SpecialistProfile) => void;
}

const ProfileHeader = ({ profile, isEditMode, onEditToggle, onProfileChange }: ProfileHeaderProps) => {
	const fullName = `${profile.firstName} ${profile.lastName}`;

	const handleChange = (field: string, value: any) => {
		onProfileChange({ ...profile, [field]: value });
	};

	return (
		<Card className="bg-primary">
			<CardBody className="py-1 px-2">
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-center gap-3">
						<img
							src={profile.profilePictureUrl || avatarImg}
							alt={fullName}
							className="rounded-circle avatar-lg"
						/>
						<div>
							{isEditMode ? (
								<div className="d-flex gap-2 mb-2">
									<Form.Control
										type="text"
										value={profile.firstName}
										onChange={(e) => handleChange('firstName', e.target.value)}
										placeholder="First Name"
										className="form-control-sm"
										style={{ maxWidth: '150px' }}
									/>
									<Form.Control
										type="text"
										value={profile.lastName}
										onChange={(e) => handleChange('lastName', e.target.value)}
										placeholder="Last Name"
										className="form-control-sm"
										style={{ maxWidth: '150px' }}
									/>
								</div>
							) : (
								<h4 className="mb-0 text-white">{fullName}</h4>
							)}
							
							{isEditMode ? (
								<Form.Control
									type="text"
									value={profile.specialization || ''}
									onChange={(e) => handleChange('specialization', e.target.value)}
									placeholder="Specialization"
									className="form-control-sm mt-1"
									style={{ maxWidth: '310px' }}
								/>
							) : (
								profile.specialization && (
									<p className="text-white-50 mb-0 mt-1">{profile.specialization}</p>
								)
							)}
						</div>
						<div className="ms-3">
							<Rating value={profile.rating} />
							<small className="text-white-50 d-block mt-1">
								{profile.rating.toFixed(1)} ({profile.stats?.totalReviews || 0} reviews)
							</small>
						</div>
					</div>
					<div className="my-1 align-self-start">
						<span className="p-1 text-white cursor-pointer" onClick={onEditToggle}>
							<i className={`mdi ${isEditMode ? 'mdi-eye' : 'mdi-pencil'} me-1`}></i>
							{isEditMode ? 'View Mode' : 'Edit Profile'}
						</span>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default ProfileHeader;
