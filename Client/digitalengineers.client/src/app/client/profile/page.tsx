import React from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useClientProfile } from '@/app/shared/hooks/useClientProfile';
import ProfileHeader from './components/ProfileHeader';
import StatsCard from './components/StatsCard';
import CompanyInfo from './components/CompanyInfo';
import ContactInfo from './components/ContactInfo';
import SecuritySettings from '@/app/shared/components/SecuritySettings';

const ClientProfilePage = () => {
	const { profile, loading, error, refetch } = useClientProfile();

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="My Profile" subName="Client" />
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
				<PageBreadcrumb title="My Profile" subName="Client" />
				<Alert variant="danger">
					<i className="mdi mdi-alert-circle-outline me-2"></i>
					{error || 'Profile not found'}
				</Alert>
			</>
		);
	}

	return (
		<>
			<PageBreadcrumb title="My Profile" subName="Client" />

			<Row>
				<Col sm={12}>
					<ProfileHeader profile={profile} onRefresh={refetch} />
				</Col>
			</Row>

			<Row>
				<Col lg={4}>
					<CompanyInfo profile={profile} onRefresh={refetch} />
					<ContactInfo profile={profile} onRefresh={refetch} />
					<SecuritySettings />
				</Col>

				<Col lg={8}>
					<StatsCard stats={profile.stats} />
				</Col>
			</Row>
		</>
	);
};

export default ClientProfilePage;
