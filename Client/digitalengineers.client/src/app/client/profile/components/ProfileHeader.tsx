import React, { useState, useRef, useCallback } from 'react';
import { Card, CardBody, Form, Spinner } from 'react-bootstrap';
import type { ClientProfile } from '@/types/client';
import { useUpdateClient } from '@/app/shared/hooks/useUpdateClient';
import { useToast } from '@/contexts/ToastContext';
import { useAuthContext } from '@/common/context/useAuthContext';
import { authApi } from '@/common/api';
import avatarImg from '@/assets/images/users/avatar-1.jpg';
import clientService from '@/services/clientService';
import './ProfileHeader.css';

interface ProfileHeaderProps {
	profile: ClientProfile;
	onRefresh: () => void;
}

const ProfileHeader = React.memo(({ profile, onRefresh }: ProfileHeaderProps) => {
	const { showSuccess, showError } = useToast();
	const { updateClient, loading: updating } = useUpdateClient();
	const { user, updateUser } = useAuthContext();
	const [isEditMode, setIsEditMode] = useState(false);
	const [editedProfile, setEditedProfile] = useState(profile);
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const fullName = `${profile.firstName} ${profile.lastName}`;

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

		// Update AuthContext with new name if changed
		if (user && (editedProfile.firstName !== profile.firstName || editedProfile.lastName !== profile.lastName)) {
			updateUser({
				...user,
				firstName: editedProfile.firstName,
				lastName: editedProfile.lastName,
			});
		}

		setIsEditMode(false);
		onRefresh();
	}, [editedProfile, profile, updateClient, user, updateUser, onRefresh]);

	const handleCancel = useCallback(() => {
		setEditedProfile(profile);
		setIsEditMode(false);
	}, [profile]);

	const handleAvatarClick = useCallback(() => {
		if (!isEditMode && !uploadingAvatar) {
			fileInputRef.current?.click();
		}
	}, [isEditMode, uploadingAvatar]);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			if (!file.type.startsWith('image/')) {
				showError('Error', 'Please select an image file');
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				showError('Error', 'File size must be less than 5MB');
				return;
			}

			try {
				setUploadingAvatar(true);

				// Upload avatar
				await clientService.uploadProfilePicture(file);

				// Get updated avatar URL from server
				const avatarResponse = await authApi.getMyAvatarUrl();

				// Update AuthContext with new presigned URL
				if (user) {
					updateUser({
						...user,
						profilePictureUrl: avatarResponse.profilePictureUrl,
					});
				}

				showSuccess('Success', 'Profile picture updated successfully');
				onRefresh();
			} catch (error: any) {
				showError('Error', error.response?.data?.message || 'Failed to upload profile picture');
			} finally {
				setUploadingAvatar(false);
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
			}
		},
		[showError, showSuccess, user, updateUser, onRefresh]
	);

	const currentProfile = isEditMode ? editedProfile : profile;

	return (
		<Card className="bg-primary">
			<CardBody className="py-1 px-2">
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-center gap-3">
						<div
							className="position-relative avatar-upload-container cursor-pointer"
							onClick={handleAvatarClick}
							style={{ width: '64px', height: '64px' }}
						>
							<img
								src={currentProfile.profilePictureUrl || avatarImg}
								alt={fullName}
								className="rounded-circle"
								style={{ width: '64px', height: '64px', objectFit: 'cover' }}
							/>
							{uploadingAvatar && (
								<div
									className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle"
									style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
								>
									<Spinner animation="border" size="sm" variant="light" />
								</div>
							)}
							{!isEditMode && !uploadingAvatar && (
								<div
									className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle avatar-upload-overlay"
									style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
								>
									<i className="mdi mdi-camera text-white" style={{ fontSize: '24px' }}></i>
								</div>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								style={{ display: 'none' }}
							/>
						</div>
						<div>
							{isEditMode ? (
								<div className="d-flex gap-2 mb-2">
									<Form.Control
										type="text"
										value={currentProfile.firstName}
										onChange={(e) => handleChange('firstName', e.target.value)}
										placeholder="First Name"
										className="form-control-sm"
										style={{ maxWidth: '150px' }}
									/>
									<Form.Control
										type="text"
										value={currentProfile.lastName}
										onChange={(e) => handleChange('lastName', e.target.value)}
										placeholder="Last Name"
										className="form-control-sm"
										style={{ maxWidth: '150px' }}
									/>
								</div>
							) : (
								<h4 className="mb-0 text-white">{fullName}</h4>
							)}

							{currentProfile.companyName && (
								<p className="text-white-50 mb-0 mt-1">
									<i className="mdi mdi-office-building me-1"></i>
									{currentProfile.companyName}
								</p>
							)}
							{currentProfile.location && (
								<p className="text-white-50 mb-0">
									<i className="mdi mdi-map-marker me-1"></i>
									{currentProfile.location}
								</p>
							)}
						</div>
					</div>
					<div className="my-1 align-self-start d-flex gap-2">
						{isEditMode ? (
							<>
								<i
									className="mdi mdi-close text-white cursor-pointer"
									style={{ fontSize: '1.3rem' }}
									onClick={handleCancel}
									title="Cancel"
								></i>
								{updating ? (
									<span className="spinner-border spinner-border-sm text-white"></span>
								) : (
									<i
										className="mdi mdi-content-save text-white cursor-pointer"
										style={{ fontSize: '1.3rem' }}
										onClick={handleSave}
										title="Save"
									></i>
								)}
							</>
						) : (
							<i
								className="mdi mdi-pencil text-white cursor-pointer"
								style={{ fontSize: '1.3rem' }}
								onClick={() => setIsEditMode(true)}
								title="Edit Profile"
							></i>
						)}
					</div>
				</div>
			</CardBody>
		</Card>
	);
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
