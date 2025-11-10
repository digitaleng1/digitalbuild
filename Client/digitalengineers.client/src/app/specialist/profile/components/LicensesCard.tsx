import { useState } from 'react';
import { Card, CardBody, Badge, Button, Alert } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { LicenseType } from '@/types/project';
import { useLicenseRequests } from '@/app/shared/hooks/useLicenseRequests';
import { LicenseRequestStatus } from '@/types/licenseRequest';
import AddLicenseRequestModal from './AddLicenseRequestModal';

interface LicensesCardProps {
	licenses: LicenseType[];
	isEditMode: boolean;
	onRefresh: () => void;
}

const LicensesCard = ({ licenses, isEditMode, onRefresh }: LicensesCardProps) => {
	const { requests, loading: requestsLoading } = useLicenseRequests();
	const [showAddModal, setShowAddModal] = useState(false);

	const pendingRequests = requests.filter(r => r.status === LicenseRequestStatus.Pending);
	const rejectedRequests = requests.filter(r => r.status === LicenseRequestStatus.Rejected);

	if (!isEditMode && (!licenses || licenses.length === 0)) {
		return null;
	}

	return (
		<>
			<Card>
				<CardBody>
					<CardTitle
						containerClass="d-flex align-items-center justify-content-between mb-3"
						title="Licenses & Certifications"
						icon="mdi mdi-certificate"
					>
						{isEditMode && (
							<Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
								<i className="mdi mdi-plus me-1"></i>
								Add License
							</Button>
						)}
					</CardTitle>

					{/* Verified Licenses */}
					{licenses.length > 0 && (
						<div className="mb-3">
							<h6 className="text-muted mb-2">Verified Licenses</h6>
							<div className="d-flex flex-wrap gap-2">
								{licenses.map((license) => (
									<Badge key={license.id} bg="success" className="p-2">
										<i className="mdi mdi-check-decagram me-1"></i>
										{license.name}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Pending Requests (Edit Mode Only) */}
					{isEditMode && pendingRequests.length > 0 && (
						<div className="mb-3">
							<h6 className="text-muted mb-2">
								<i className="mdi mdi-clock-outline me-1"></i>
								Pending Verification ({pendingRequests.length})
							</h6>
							{pendingRequests.map((request) => (
								<Alert key={request.id} variant="warning" className="mb-2 py-2">
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<strong>{request.licenseTypeName}</strong>
											<br />
											<small className="text-muted">
												{request.state} • {request.licenseNumber}
											</small>
										</div>
										<Badge bg="warning" text="dark">Pending</Badge>
									</div>
								</Alert>
							))}
						</div>
					)}

					{/* Rejected Requests (Edit Mode Only) */}
					{isEditMode && rejectedRequests.length > 0 && (
						<div className="mb-3">
							<h6 className="text-muted mb-2">
								<i className="mdi mdi-close-circle-outline me-1"></i>
								Rejected ({rejectedRequests.length})
							</h6>
							{rejectedRequests.map((request) => (
								<Alert key={request.id} variant="danger" className="mb-2 py-2">
									<div>
										<strong>{request.licenseTypeName}</strong>
										<br />
										<small className="text-muted">
											Reason: {request.adminComment || 'No reason provided'}
										</small>
									</div>
								</Alert>
							))}
						</div>
					)}

					{/* Empty State */}
					{!isEditMode && licenses.length === 0 && (
						<Alert variant="info" className="mb-0">
							<i className="mdi mdi-information-outline me-2"></i>
							No verified licenses yet.
						</Alert>
					)}
				</CardBody>
			</Card>

			{isEditMode && (
				<AddLicenseRequestModal
					show={showAddModal}
					onHide={() => setShowAddModal(false)}
					onSuccess={() => {
						onRefresh();
						setShowAddModal(false);
					}}
				/>
			)}
		</>
	);
};

export default LicensesCard;
