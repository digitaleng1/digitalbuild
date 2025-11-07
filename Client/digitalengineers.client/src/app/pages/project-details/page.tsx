import { Row, Col, Card, CardBody, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '@/common/context/useAuthContext';
import { useState } from 'react';
import Comments from '@/app/client/projects/details/Comments';
import ProgressChart from '@/app/client/projects/details/ProgressChart';
import Files from '@/app/client/projects/details/Files';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import CardTitle from '@/components/CardTitle';
import { useProjectDetails } from '@/app/shared/hooks';
import { getProjectScopeLabel, getStatusBadgeVariant } from '@/utils/projectUtils';
import { TeamMembers } from '@/app/shared/components/common';
import ProjectStatusModal from '@/app/admin/projects/details/ProjectStatusModal';
import QuoteCreationCard from '@/app/admin/projects/details/QuoteCreationCard';
import QuoteReviewCard from '@/app/client/projects/details/QuoteReviewCard';
import QuoteAcceptedAlert from '@/app/client/projects/details/QuoteAcceptedAlert';
import QuoteSubmittedAlert from '@/app/client/projects/details/QuoteSubmittedAlert';
import PendingAlert from '@/app/client/projects/details/PendingAlert';
import classNames from 'classnames';

const ProjectDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const projectId = id ? parseInt(id, 10) : undefined;
	const { hasAnyRole } = useAuthContext();
	const [showStatusModal, setShowStatusModal] = useState(false);
	
	const { project, loading, error, refetch, updateProjectStatus } = useProjectDetails(projectId);

	const isAdmin = hasAnyRole(['Admin', 'SuperAdmin']);
	const isClient = hasAnyRole(['Client']);
	const isProvider = hasAnyRole(['Provider']);

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="Project Details" subName="Projects" />
				<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
					<Spinner animation="border" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
				</div>
			</>
		);
	}

	if (error || !project) {
		return (
			<>
				<PageBreadcrumb title="Project Details" subName="Projects" />
				<Alert variant="danger">
					<Alert.Heading>Error Loading Project</Alert.Heading>
					<p>{error || 'Project not found'}</p>
				</Alert>
			</>
		);
	}

	const createdDate = new Date(project.createdAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const updatedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const statusVariant = getStatusBadgeVariant(project.status);
	const scopeLabel = getProjectScopeLabel(project.projectScope);
	const clientInitial = project.clientName ? project.clientName.charAt(0).toUpperCase() : '?';

	const menuItems = isAdmin
		? [
				{ label: 'View as Client', icon: 'mdi mdi-eye' },
				{ label: 'Assign Provider', icon: 'mdi mdi-account-plus' },
				{ label: 'Project History', icon: 'mdi mdi-history' },
			]
		: [
				{ label: 'Edit', icon: 'mdi mdi-pencil' },
				{ label: 'Delete', icon: 'mdi mdi-delete' },
				{ label: 'Invite', icon: 'mdi mdi-email-outline' },
				{ label: 'Leave', icon: 'mdi mdi-exit-to-app' },
			];

	const handleRibbonClick = () => {
		if (isAdmin) {
			setShowStatusModal(true);
		}
	};

	const handleStatusUpdated = (newStatus: string) => {
		updateProjectStatus(newStatus);
		setShowStatusModal(false);
	};

	return (
		<>
			<PageBreadcrumb title="Project Details" subName="Projects" />

			{/* Status Alerts for Client */}
			{isClient && (
				<>
					<PendingAlert project={project} />
					<QuoteSubmittedAlert project={project} />
					<QuoteAcceptedAlert project={project} />
				</>
			)}

			<Row>
				<Col xl={8} lg={6}>
					<Card className="d-block ribbon-box">
						<CardBody>
							{/* Status Ribbon */}
							<div
								className={classNames(
									'ribbon',
									`ribbon-${statusVariant}`,
									{ 'bg-dark text-light': statusVariant === 'dark' },
									{ 'bg-secondary text-light': statusVariant === 'secondary' },
									'float-start',
									{ 'cursor-pointer': isAdmin }
								)}
								onClick={handleRibbonClick}
								style={isAdmin ? { cursor: 'pointer' } : undefined}
								title={isAdmin ? 'Click to change status' : undefined}
							>
								<i className={`mdi ${isAdmin ? 'mdi-pencil' : 'mdi-circle-slice-8'} me-1`}></i> {project.status}
							</div>

							<CardTitle
								containerClass="d-flex justify-content-between align-items-center mb-2"
								icon="ri-more-fill"
								title={<h3 className="mt-0">{project.name}</h3>}
								menuItems={menuItems}
							/>
							
							{/* Project Info */}
							<div className="d-flex flex-wrap align-items-center gap-3 mb-3 ribbon-content">
								<div className="d-flex align-items-center text-muted">
									<i className="mdi mdi-calendar me-1"></i>
									<small>Created: {createdDate}</small>
								</div>
								<div className="d-flex align-items-center text-muted">
									<i className="mdi mdi-update me-1"></i>
									<small>Updated: {updatedDate}</small>
								</div>
								<div className="d-flex align-items-center text-muted">
									<i className="mdi mdi-chart-timeline-variant me-1"></i>
									<small>Scope: {scopeLabel}</small>
								</div>
							</div>

							{project.thumbnailUrl && (
								<Row className="mb-4">
									<Col md={8}>
										<img
											src={project.thumbnailUrl}
											alt={project.name}
											className="img-fluid rounded"
											style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
										/>
									</Col>
									<Col md={4}>
										{/* Client Information */}
										<div className="mb-4">
											<h5 className="mb-3">Client Information:</h5>
											<div className="d-flex align-items-center">
												{isAdmin ? (
													<Link to="#" className="text-decoration-none d-flex align-items-center" title={`View ${project.clientName}'s profile`}>
														<div className="flex-shrink-0">
															{project.clientProfilePictureUrl ? (
																<img
																	src={project.clientProfilePictureUrl}
																	alt={project.clientName}
																	className="rounded-circle"
																	style={{ width: '40px', height: '40px', objectFit: 'cover' }}
																/>
															) : (
																<div
																	className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
																	style={{ width: '40px', height: '40px', fontSize: '16px', fontWeight: 'bold' }}
																>
																	{clientInitial}
																</div>
															)}
														</div>
														<div className="ms-2">
															<h6 className="my-0 text-secondary">
																{project.clientName || 'Unknown Client'}
																<i className="mdi mdi-open-in-new ms-1" style={{ fontSize: '12px' }}></i>
															</h6>
															<p className="text-muted mb-0 small">
																<i className="mdi mdi-email-outline me-1"></i>
																{project.clientEmail || 'No email'}
															</p>
														</div>
													</Link>
												) : (
													<>
														<div className="flex-shrink-0">
															{project.clientProfilePictureUrl ? (
																<img
																	src={project.clientProfilePictureUrl}
																	alt={project.clientName}
																	className="rounded-circle"
																	style={{ width: '40px', height: '40px', objectFit: 'cover' }}
																/>
															) : (
																<div
																	className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
																	style={{ width: '40px', height: '40px', fontSize: '16px', fontWeight: 'bold' }}
																>
																	{clientInitial}
																</div>
															)}
														</div>
														<div className="ms-2">
															<h6 className="my-0">{project.clientName || 'Unknown Client'}</h6>
															<p className="text-muted mb-0 small">
																<i className="mdi mdi-email-outline me-1"></i>
																{project.clientEmail || 'No email'}
															</p>
														</div>
													</>
												)}
											</div>
										</div>

										{/* Quote Information */}
										{!isProvider && (
											<div className="mb-4">
												<h5 className="mb-3">Quote Information:</h5>
												{!project.quotedAmount ? (
													<p className="mb-0">
														<i className="mdi mdi-information-outline text-muted me-1"></i>
														<span className="text-muted">Price not available</span>
													</p>
												) : project.status === 'QuoteSubmitted' ? (
													<p className="mb-0">
														<i className="mdi mdi-clock-outline text-warning me-1"></i>
														<span className="text-muted">Pending approval</span>
													</p>
												) : (
													<p className="mb-0">
														<i className="mdi mdi-check-circle text-success me-1"></i>
														<strong className="text-success">
															{new Intl.NumberFormat('en-US', {
																style: 'currency',
																currency: 'USD',
															}).format(project.quotedAmount)}
														</strong>
													</p>
												)}
											</div>
										)}

										{/* Location */}
										<div>
											<h5 className="mb-3">Project Location:</h5>
											<p className="mb-0">
												<i className="mdi mdi-map-marker me-1"></i>
												{project.streetAddress}
												<br />
												<span className="ms-3">{project.city}, {project.state} {project.zipCode}</span>
											</p>
										</div>
									</Col>
								</Row>
							)}

							<h5>Project Overview:</h5>
							<p className="text-muted mb-4">{project.description}</p>

							{project.licenseTypes && project.licenseTypes.length > 0 && (
								<>
									<h5>Required Professionals:</h5>
									<div className="mb-4">
										{project.licenseTypes.map((licenseType) => (
											<Badge
												key={licenseType.id}
												bg="primary"
												className="me-2 mb-2 p-2"
												style={{ fontSize: '0.875rem' }}
											>
												{licenseType.name}
											</Badge>
										))}
									</div>
								</>
							)}

							<TeamMembers 
								projectId={project.id} 
								isAdmin={isAdmin} 
								requiredLicenseTypes={project.licenseTypes || []} 
							/>
						</CardBody>
					</Card>

					<Comments />
				</Col>

				<Col xl={4} lg={6}>
					{/* Admin: Quote Card - ALWAYS VISIBLE */}
					{isAdmin && (
						<QuoteCreationCard
							projectId={project.id}
							project={project}
							onQuoteSubmitted={refetch}
						/>
					)}

					{/* Client: Quote Review (when status = QuoteSubmitted) */}
					{isClient && project.status === 'QuoteSubmitted' && (
						<QuoteReviewCard
							project={project}
							onQuoteAccepted={refetch}
							onQuoteRejected={refetch}
						/>
					)}

					<ProgressChart />
					<Files files={project.files} />
				</Col>
			</Row>

			{/* Status Modal for Admin */}
			{isAdmin && (
				<ProjectStatusModal
					show={showStatusModal}
					onHide={() => setShowStatusModal(false)}
					projectId={project.id}
					currentStatus={project.status}
					onStatusUpdated={handleStatusUpdated}
				/>
			)}
		</>
	);
};

export default ProjectDetailsPage;
