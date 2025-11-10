import { useState } from 'react';
import { Card, CardBody, Button } from 'react-bootstrap';
import type { SpecialistProfile } from '@/types/specialist';
import Rating from '@/components/Rating';
import avatarImg from '@/assets/images/users/avatar-1.jpg';
import EditProfileModal from './EditProfileModal';

interface ProfileHeaderProps {
	profile: SpecialistProfile;
	onProfileUpdated: () => void;
}

const ProfileHeader = ({ profile, onProfileUpdated }: ProfileHeaderProps) => {
	const fullName = `${profile.firstName} ${profile.lastName}`;
	const [showEditModal, setShowEditModal] = useState(false);

	const handleEditProfile = () => {
		setShowEditModal(true);
	};

	const handleModalSuccess = () => {
		onProfileUpdated();
	};

	return (
		<>
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
								<h4 className="mb-0 text-white">{fullName}</h4>
								{profile.specialization && (
									<p className="text-white-50 mb-0 mt-1">{profile.specialization}</p>
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
							<span className="p-1 text-white cursor-pointer" onClick={handleEditProfile}>
								<i className="mdi mdi-pencil me-1"></i>
								Edit Profile
							</span>
						</div>
					</div>
				</CardBody>
			</Card>

			<EditProfileModal
				show={showEditModal}
				profile={profile}
				onHide={() => setShowEditModal(false)}
				onSuccess={handleModalSuccess}
			/>
		</>
	);
};

export default ProfileHeader;
