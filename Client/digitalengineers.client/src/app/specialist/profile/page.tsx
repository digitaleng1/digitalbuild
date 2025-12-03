import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useSpecialistProfile } from '@/app/shared/hooks/useSpecialistProfile';
import ProfileHeader from './components/ProfileHeader';
import StatsCard from './components/StatsCard';
import ProfessionalInfo from './components/ProfessionalInfo';
import LicensesCard from './components/LicensesCard';
import PortfolioSection from './components/PortfolioSection';
import ProjectsList from './components/ProjectsList';
import ReviewsSection from './components/ReviewsSection';
import SecuritySettings from '@/app/shared/components/SecuritySettings';

const SpecialistProfilePage = () => {
	const { profile, loading, error, refetch } = useSpecialistProfile();

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

	return (
		<>
			<PageBreadcrumb title="My Profile" subName="Specialist" />

			<Row>
				<Col sm={12}>
					<ProfileHeader 
						profile={profile}
						onRefresh={refetch}
					/>
				</Col>
			</Row>

			<Row>
				<Col lg={4}>
					<StatsCard stats={profile.stats} />
					<ProfessionalInfo 
						profile={profile}
						onRefresh={refetch}
					/>
					<LicensesCard 
						licenses={profile.licenseTypes}
						isOwnProfile={true}
						onRefresh={refetch}
					/>
					<SecuritySettings />
				</Col>

				<Col lg={8}>
					<ReviewsSection reviews={profile.reviews} />
					<ProjectsList projects={profile.assignedProjects} />
					<PortfolioSection
						portfolio={profile.portfolio}
						specialistId={profile.id}
						onRefresh={refetch}
					/>
				</Col>
			</Row>
		</>
	);
};

export default SpecialistProfilePage;
