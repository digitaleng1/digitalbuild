import { useState, useEffect, useCallback } from 'react';
import userProfileService from '@/services/userProfileService';
import type { UserProfile, UpdateUserProfile } from '@/types/user-profile';
import { useToast } from '@/contexts/ToastContext';
import { useAuthContext } from '@/common/context/useAuthContext';

export const useUserProfile = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { showError, showSuccess } = useToast();
	const { updateUser } = useAuthContext();

	const fetchProfile = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await userProfileService.getUserProfile();
			setProfile(data);
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || 'Failed to load profile';
			setError(errorMsg);
			showError('Error', errorMsg);
		} finally {
			setLoading(false);
		}
	}, [showError]);

	const updateProfile = async (data: UpdateUserProfile) => {
		try {
			const updated = await userProfileService.updateUserProfile(data);
			setProfile(updated);

			// Update auth context with new user data
			updateUser({
				id: updated.userId,
				email: updated.email,
				firstName: updated.firstName,
				lastName: updated.lastName,
				profilePictureUrl: updated.profilePictureUrl,
				roles: updated.roles,
			});

			showSuccess('Success', 'Profile updated successfully');
			return updated;
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || 'Failed to update profile';
			showError('Error', errorMsg);
			throw err;
		}
	};

	const uploadAvatar = async (file: File) => {
		try {
			const updated = await userProfileService.uploadAvatar(file);
			setProfile(updated);

			// Update auth context with new avatar
			updateUser({
				id: updated.userId,
				email: updated.email,
				firstName: updated.firstName,
				lastName: updated.lastName,
				profilePictureUrl: updated.profilePictureUrl,
				roles: updated.roles,
			});

			showSuccess('Success', 'Avatar updated successfully');
			return updated;
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || 'Failed to upload avatar';
			showError('Error', errorMsg);
			throw err;
		}
	};

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	return { profile, loading, error, updateProfile, uploadAvatar, refetch: fetchProfile };
};
