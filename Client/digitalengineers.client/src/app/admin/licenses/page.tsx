import { useCallback, useMemo, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useAdminLicenseRequests } from './hooks/useAdminLicenseRequests';
import LicensesTable from './components/LicensesTable';
import LicenseDetailsModal from './components/LicenseDetailsModal';
import type { LicenseRequest } from '@/types/licenseRequest';

const PageTitle = ({ title }: { title: string }) => {
	return <title>{title} | Novobid</title>;
};

export default function LicensesPage() {
	const { licenseRequests, isLoading, refetch } = useAdminLicenseRequests();
	const [selectedLicense, setSelectedLicense] = useState<LicenseRequest | null>(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);

	const handleViewDetails = useCallback((license: LicenseRequest) => {
		setSelectedLicense(license);
		setShowDetailsModal(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setShowDetailsModal(false);
		setSelectedLicense(null);
	}, []);

	const handleActionSuccess = useCallback(() => {
		refetch();
	}, [refetch]);

	const stats = useMemo(() => {
		return {
			total: licenseRequests.length,
			pending: licenseRequests.filter((lr) => lr.status === 'Pending').length,
		};
	}, [licenseRequests]);

	return (
		<>
			<PageTitle title="License Requests Management" />
			<PageBreadcrumb title="License Requests" subName="Management" />

			<Row>
				<Col lg={4}>
					<Card>
						<Card.Body>
							<div className="d-flex align-items-center">
								<div className="flex-shrink-0 me-3">
									<div className="avatar-sm">
										<div className="avatar-title bg-primary-subtle text-primary rounded">
											<i className="uil uil-clipboard-alt font-24" />
										</div>
									</div>
								</div>
								<div className="flex-grow-1">
									<h5 className="mb-1 mt-0">{stats.total}</h5>
									<p className="mb-0 text-muted">Total Requests</p>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col lg={4}>
					<Card>
						<Card.Body>
							<div className="d-flex align-items-center">
								<div className="flex-shrink-0 me-3">
									<div className="avatar-sm">
										<div className="avatar-title bg-warning-subtle text-warning rounded">
											<i className="uil uil-clock font-24" />
										</div>
									</div>
								</div>
								<div className="flex-grow-1">
									<h5 className="mb-1 mt-0">{stats.pending}</h5>
									<p className="mb-0 text-muted">Pending Review</p>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col lg={4}>
					<Card>
						<Card.Body>
							<div className="d-flex align-items-center">
								<div className="flex-shrink-0 me-3">
									<div className="avatar-sm">
										<div className="avatar-title bg-success-subtle text-success rounded">
											<i className="uil uil-check font-24" />
										</div>
									</div>
								</div>
								<div className="flex-grow-1">
									<Button variant="primary" size="sm" onClick={() => refetch()}>
										<i className="uil uil-refresh me-1" />
										Refresh
									</Button>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Pending License Requests</h4>
							<LicensesTable
								licenseRequests={licenseRequests}
								isLoading={isLoading}
								onViewDetails={handleViewDetails}
								onActionSuccess={handleActionSuccess}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{selectedLicense && (
				<LicenseDetailsModal
					show={showDetailsModal}
					license={selectedLicense}
					onClose={handleCloseModal}
					onActionSuccess={handleActionSuccess}
				/>
			)}
		</>
	);
}
