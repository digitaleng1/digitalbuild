import { useState, useRef } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import type { UserProfile } from '@/types/user-profile';
import { useAuthContext } from '@/common/context/useAuthContext';
import { authApi } from '@/common/api';
import { useToast } from '@/contexts/ToastContext';

interface ProfileHeaderProps {
	profile: UserProfile;
	onUploadAvatar: (file: File) => Promise<void>;
	uploading: boolean;
}

const ProfileHeader = ({ profile, onUploadAvatar, uploading }: ProfileHeaderProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { user, updateUser } = useAuthContext();
	const { showError } = useToast();

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
			await onUploadAvatar(file);
			const avatarResponse = await authApi.getMyAvatarUrl();
			
			if (user) {
				updateUser({
					...user,
					profilePictureUrl: avatarResponse.profilePictureUrl
				});
			}
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const formatLastActive = (dateString?: string) => {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		
		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins} minutes ago`;
		
		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours} hours ago`;
		
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays < 7) return `${diffDays} days ago`;
		
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	};

	return (
		<Card>
			<Card.Body>
				<div className="d-flex align-items-center">
					<div 
						className="position-relative"
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						style={{ cursor: 'pointer' }}
						onClick={handleAvatarClick}
					>
						{profile.profilePictureUrl ? (
							<img
								src={profile.profilePictureUrl}
								alt={`${profile.firstName} ${profile.lastName}`}
								className="rounded-circle"
								style={{ 
									width: '120px', 
									height: '120px', 
									objectFit: 'cover',
									opacity: isHovered ? 0.7 : 1,
									transition: 'opacity 0.2s'
								}}
							/>
						) : (
							<div 
								className="rounded-circle bg-light d-flex align-items-center justify-content-center"
								style={{ 
									width: '120px', 
									height: '120px',
									opacity: isHovered ? 0.7 : 1,
									transition: 'opacity 0.2s'
								}}
							>
								<i className="mdi mdi-account text-muted" style={{ fontSize: '60px' }}></i>
							</div>
						)}
						{isHovered && !uploading && (
							<div 
								className="position-absolute top-50 start-50 translate-middle"
								style={{ pointerEvents: 'none' }}
							>
								<i className="mdi mdi-camera text-white" style={{ fontSize: '40px' }}></i>
							</div>
						)}
						{uploading && (
							<div 
								className="position-absolute top-50 start-50 translate-middle"
								style={{ pointerEvents: 'none' }}
							>
								<Spinner animation="border" variant="primary" />
							</div>
						)}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							style={{ display: 'none' }}
							onChange={handleFileChange}
							disabled={uploading}
						/>
					</div>

					<div className="ms-4 flex-grow-1">
						<h3 className="mb-1">
							{profile.firstName} {profile.lastName}
						</h3>
						<p className="text-muted mb-2">
							<i className="mdi mdi-email me-1"></i>
							{profile.email}
						</p>
						<div className="d-flex flex-wrap gap-2 mb-2">
							{profile.roles.map((role) => (
								<span 
									key={role} 
									className={`badge ${
										role === 'SuperAdmin' ? 'bg-danger' : 
										role === 'Admin' ? 'bg-primary' : 
										'bg-secondary'
									}`}
								>
									{role}
								</span>
							))}
						</div>
						<p className="text-muted mb-0">
							<i className="mdi mdi-clock-outline me-1"></i>
							Last active: {formatLastActive(profile.lastActive)}
						</p>
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

export default ProfileHeader;
