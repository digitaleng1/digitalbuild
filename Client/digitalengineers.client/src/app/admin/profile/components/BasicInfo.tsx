import { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { UserProfile, UpdateUserProfile } from '@/types/user-profile';
import { useAuthContext } from '@/common/context/useAuthContext';

interface BasicInfoProps {
	profile: UserProfile;
	onUpdate: (data: UpdateUserProfile) => Promise<void>;
	updating: boolean;
}

const BasicInfo = ({ profile, onUpdate, updating }: BasicInfoProps) => {
	const [isEditMode, setIsEditMode] = useState(false);
	const { user, updateUser } = useAuthContext();
	const [formData, setFormData] = useState<UpdateUserProfile>({
		firstName: profile.firstName,
		lastName: profile.lastName,
		phoneNumber: profile.phoneNumber,
		location: profile.location,
		biography: profile.biography,
		website: profile.website,
	});

	const handleChange = (field: keyof UpdateUserProfile, value: string) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleSave = async () => {
		await onUpdate(formData);
		
		if (user && (formData.firstName !== profile.firstName || formData.lastName !== profile.lastName)) {
			updateUser({
				...user,
				firstName: formData.firstName,
				lastName: formData.lastName
			});
		}
		
		setIsEditMode(false);
	};

	const handleCancel = () => {
		setFormData({
			firstName: profile.firstName,
			lastName: profile.lastName,
			phoneNumber: profile.phoneNumber,
			location: profile.location,
			biography: profile.biography,
			website: profile.website,
		});
		setIsEditMode(false);
	};

	return (
		<Card>
			<Card.Body>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Basic Information"
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
					<h6 className="text-muted mb-1">First Name</h6>
					{isEditMode ? (
						<Form.Control
							type="text"
							value={formData.firstName}
							onChange={(e) => handleChange('firstName', e.target.value)}
							placeholder="Enter first name"
							maxLength={50}
							required
						/>
					) : (
						<p className="mb-0">{profile.firstName}</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Last Name</h6>
					{isEditMode ? (
						<Form.Control
							type="text"
							value={formData.lastName}
							onChange={(e) => handleChange('lastName', e.target.value)}
							placeholder="Enter last name"
							maxLength={50}
							required
						/>
					) : (
						<p className="mb-0">{profile.lastName}</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Phone Number</h6>
					{isEditMode ? (
						<Form.Control
							type="tel"
							value={formData.phoneNumber || ''}
							onChange={(e) => handleChange('phoneNumber', e.target.value)}
							placeholder="Enter phone number"
							maxLength={20}
						/>
					) : (
						<p className="mb-0">
							{profile.phoneNumber ? (
								<>
									<i className="mdi mdi-phone me-1"></i>
									{profile.phoneNumber}
								</>
							) : (
								'Not specified'
							)}
						</p>
					)}
				</div>

				<div className="mb-3">
					<h6 className="text-muted mb-1">Location</h6>
					{isEditMode ? (
						<Form.Control
							type="text"
							value={formData.location || ''}
							onChange={(e) => handleChange('location', e.target.value)}
							placeholder="Enter location"
							maxLength={100}
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
					<h6 className="text-muted mb-1">Biography</h6>
					{isEditMode ? (
						<Form.Control
							as="textarea"
							rows={4}
							value={formData.biography || ''}
							onChange={(e) => handleChange('biography', e.target.value)}
							placeholder="Tell us about yourself"
							maxLength={500}
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
							value={formData.website || ''}
							onChange={(e) => handleChange('website', e.target.value)}
							placeholder="https://example.com"
							maxLength={200}
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
			</Card.Body>
		</Card>
	);
};

export default BasicInfo;
