import { useState } from 'react';
import { Card, CardBody, Badge, Alert, Button } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { LicenseType } from '@/types/project';
import type { LicenseRequest } from '@/types/licenseRequest';
import { useLicenseRequests } from '@/app/shared/hooks/useLicenseRequests';
import { LicenseRequestStatus } from '@/types/licenseRequest';
import AddLicenseRequestModal from './AddLicenseRequestModal';
import EditLicenseRequestModal from './EditLicenseRequestModal';

interface LicensesCardProps {
	licenses: LicenseType[];
	isOwnProfile: boolean;
	onRefresh: () => void;
}

const LicensesCard = ({ licenses, isOwnProfile, onRefresh }: LicensesCardProps) => {
	const { requests, loading: requestsLoading, refetch } = useLicenseRequests();
	const [showAddModal, setShowAddModal] = useState(false);
	const [editRequest, setEditRequest] = useState<LicenseRequest | null>(null);

	const pendingRequests = requests.filter(r => r.status === LicenseRequestStatus.Pending);
	const rejectedRequests = requests.filter(r => r.status === LicenseRequestStatus.Rejected);

	const handleEditSuccess = () => {
		refetch();
		onRefresh();
		setEditRequest(null);
	};

	if (!isOwnProfile && (!licenses || licenses.length === 0)) {
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
						{isOwnProfile && (
							<i 
								className="link-success  mdi mdi-plus-circle cursor-pointer"
								style={{ fontSize: '1.5rem' }}
								onClick={() => setShowAddModal(true)}
								title="Add License"
							></i>
						)}
					</CardTitle>

					{/* Verified Licenses */}
					{licenses.length > 0 && (
						<div className="mb-3">
							<h6 className="text-muted mb-2">Verified Licenses</h6>
							<div className="d-flex flex-wrap gap-2">
								{licenses.map((license) => (
									<Badge key={`license-verified-${license.id}`} bg="success" className="p-2">
										<i className="mdi mdi-check-decagram me-1"></i>
										{license.professionName && (
											<span className="me-1">{license.professionName} -</span>
										)}
										{license.name}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Pending Requests (Own Profile Only) */}
					{isOwnProfile && pendingRequests.length > 0 && (
						<div className="mb-3">
							<h6 className="text-muted mb-2">
								<i className="mdi mdi-clock-outline me-1"></i>
								Pending Verification ({pendingRequests.length})
							</h6>
							{pendingRequests.map((request) => (
								<Alert key={`${request.specialistId}-${request.licenseTypeId}-${request.professionTypeId}`} variant="warning" className="mb-2 py-2">
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<strong>{request.licenseTypeName}</strong>
											<br />
											<small className="text-muted">
												{request.professionTypeName} • {request.state} • {request.licenseNumber}
											</small>
										</div>
										<Badge bg="warning" text="dark">Pending</Badge>
									</div>
								</Alert>
							))}
						</div>
					)}

					{/* Rejected Requests (Own Profile Only) */}
					{isOwnProfile && rejectedRequests.length > 0 && (
						<div className="mb-3">
							<h6 className="text-muted mb-2">
								<i className="mdi mdi-close-circle-outline me-1"></i>
								Rejected ({rejectedRequests.length})
							</h6>
							{rejectedRequests.map((request) => (
								<Alert key={`${request.specialistId}-${request.licenseTypeId}-${request.professionTypeId}`} variant="danger" className="mb-2 py-2">
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<strong>{request.licenseTypeName}</strong>
											<br />
											<small className="text-muted">
												{request.professionTypeName}
											</small>
											<br />
											<small className="text-muted">
												Reason: {request.adminComment || 'No reason provided'}
											</small>
										</div>
										<Button
											variant="outline-primary"
											size="sm"
											onClick={() => setEditRequest(request)}
											title="Edit and resubmit"
										>
											<i className="mdi mdi-pencil me-1"></i>
											Edit
										</Button>
									</div>
								</Alert>
							))}
						</div>
					)}

					{/* Empty State */}
					{licenses.length === 0 && (
						<Alert variant="info" className="mb-0">
							<i className="mdi mdi-information-outline me-2"></i>
							{isOwnProfile 
								? 'No verified licenses yet. Add your first license to get started.'
								: 'No verified licenses yet.'}
						</Alert>
					)}
				</CardBody>
			</Card>

			{isOwnProfile && (
				<>
					<AddLicenseRequestModal
						show={showAddModal}
						onHide={() => setShowAddModal(false)}
						onSuccess={() => {
							refetch();
							onRefresh();
							setShowAddModal(false);
						}}
					/>

					{editRequest && (
						<EditLicenseRequestModal
							show={!!editRequest}
							onHide={() => setEditRequest(null)}
							onSuccess={handleEditSuccess}
							licenseRequest={editRequest}
						/>
					)}
				</>
			)}
		</>
	);
};

export default LicensesCard;
