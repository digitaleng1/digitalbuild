import { useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useUserProfile } from '@/app/shared/hooks/useUserProfile';
import ProfileHeader from './components/ProfileHeader';
import BasicInfo from './components/BasicInfo';
import AccountInfo from './components/AccountInfo';
import SecuritySettings from '@/app/shared/components/SecuritySettings';
import NotificationsCard from '@/app/shared/components/NotificationsCard';

const AdminProfilePage = () => {
	const { profile, loading, error, updateProfile, uploadAvatar, refetch } = useUserProfile();
	const [updating, setUpdating] = useState(false);
	const [uploading, setUploading] = useState(false);

	const handleUpdateProfile = async (data: any) => {
		setUpdating(true);
		try {
			await updateProfile(data);
		} finally {
			setUpdating(false);
		}
	};

	const handleUploadAvatar = async (file: File) => {
		setUploading(true);
		try {
			await uploadAvatar(file);
		} finally {
			setUploading(false);
		}
	};

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="My Profile" subName="Admin" />
				<div className="text-center py-5">
					<Spinner animation="border" variant="primary" />
					<p className="mt-3">Loading profile...</p>
				</div>
			</>
		);
	}

	if (error || !profile) {
		return (
			<>
				<PageBreadcrumb title="My Profile" subName="Admin" />
				<Alert variant="danger">
					<i className="mdi mdi-alert-circle-outline me-2"></i>
					{error || 'Profile not found'}
				</Alert>
			</>
		);
	}

	return (
		<>
			<PageBreadcrumb title="My Profile" subName="Admin" />

			<Row>
				<Col sm={12}>
					<ProfileHeader 
						profile={profile}
						onUploadAvatar={handleUploadAvatar}
						uploading={uploading}
					/>
				</Col>
			</Row>

			<Row>
				<Col lg={4}>
					<BasicInfo 
						profile={profile}
						onUpdate={handleUpdateProfile}
						updating={updating}
					/>
				</Col>

				<Col lg={4}>
					<SecuritySettings />
				</Col>

				<Col lg={4}>
					<AccountInfo profile={profile} />
				</Col>
			</Row>

			<Row>
				<Col lg={12}>
					<NotificationsCard />
				</Col>
			</Row>
		</>
	);
};

export default AdminProfilePage;
