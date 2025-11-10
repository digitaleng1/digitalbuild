import { useState } from 'react';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useSpecialistProfile } from '@/app/shared/hooks/useSpecialistProfile';
import { useUpdateSpecialist } from '@/app/shared/hooks/useUpdateSpecialist';
import ProfileHeader from './components/ProfileHeader';
import StatsCard from './components/StatsCard';
import ProfessionalInfo from './components/ProfessionalInfo';
import LicensesCard from './components/LicensesCard';
import PortfolioSection from './components/PortfolioSection';
import ProjectsList from './components/ProjectsList';
import ReviewsSection from './components/ReviewsSection';
import type { SpecialistProfile, UpdateSpecialistDto } from '@/types/specialist';

const SpecialistProfilePage = () => {
	const { profile, loading, error, refetch } = useSpecialistProfile();
	const { updateSpecialist, loading: updating } = useUpdateSpecialist();
	const [isEditMode, setIsEditMode] = useState(false);
	const [editedProfile, setEditedProfile] = useState<SpecialistProfile | null>(null);

	const handleEditToggle = () => {
		if (!isEditMode && profile) {
			setEditedProfile({ ...profile });
		} else {
			setEditedProfile(null);
		}
		setIsEditMode(!isEditMode);
	};

	const handleCancel = () => {
		setIsEditMode(false);
		setEditedProfile(null);
	};

	const handleSave = async () => {
		if (!editedProfile) return;

		const updateDto: UpdateSpecialistDto = {
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
		};

		try {
			await updateSpecialist(editedProfile.id, updateDto);
			setIsEditMode(false);
			setEditedProfile(null);
			refetch();
		} catch (error) {
			// Error handling is done in useUpdateSpecialist hook
		}
	};

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="My Profile" subName="Specialist" />
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
				<PageBreadcrumb title="My Profile" subName="Specialist" />
				<Alert variant="danger">
					<i className="mdi mdi-alert-circle-outline me-2"></i>
					{error || 'Profile not found'}
				</Alert>
			</>
		);
	}

	const currentProfile = isEditMode && editedProfile ? editedProfile : profile;

	return (
		<>
			<PageBreadcrumb title="My Profile" subName="Specialist" />

			<Row>
				<Col sm={12}>
					<ProfileHeader 
						profile={currentProfile} 
						isEditMode={isEditMode}
						onEditToggle={handleEditToggle}
						onProfileChange={setEditedProfile}
					/>
				</Col>
			</Row>

			{isEditMode && (
				<Row className="mb-3">
					<Col sm={12}>
						<div className="d-flex justify-content-end gap-2">
							<Button variant="secondary" onClick={handleCancel} disabled={updating}>
								<i className="mdi mdi-close me-1"></i>
								Cancel
							</Button>
							<Button variant="success" onClick={handleSave} disabled={updating}>
								{updating ? (
									<>
										<span className="spinner-border spinner-border-sm me-2"></span>
										Saving...
									</>
								) : (
									<>
										<i className="mdi mdi-content-save me-1"></i>
										Save Changes
									</>
								)}
							</Button>
						</div>
					</Col>
				</Row>
			)}

			<Row>
				<Col lg={4}>
					<StatsCard stats={currentProfile.stats} />
					<ProfessionalInfo 
						profile={currentProfile} 
						isEditMode={isEditMode}
						onProfileChange={setEditedProfile}
					/>
					<LicensesCard 
						licenses={currentProfile.licenseTypes}
						isEditMode={isEditMode}
						onRefresh={refetch}
					/>
				</Col>

				<Col lg={8}>
					<PortfolioSection 
						portfolio={currentProfile.portfolio} 
						specialistId={currentProfile.id}
						isEditMode={isEditMode}
						onRefresh={refetch}
					/>
					<ProjectsList projects={currentProfile.assignedProjects} />
					<ReviewsSection reviews={currentProfile.reviews} />
				</Col>
			</Row>
		</>
	);
};

export default SpecialistProfilePage;
