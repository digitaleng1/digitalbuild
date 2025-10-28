import { Row, Col, Card, CardBody, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '@/common/context/useAuthContext';
import Comments from '@/app/client/projects/details/Comments';
import ProgressChart from '@/app/client/projects/details/ProgressChart';
import Files from '@/app/client/projects/details/Files';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import CardTitle from '@/components/CardTitle';
import { useProjectDetails } from '@/app/shared/hooks';
import { getProjectScopeLabel, getStatusBadgeVariant } from '@/utils/projectUtils';
import { TeamMembers } from '@/app/shared/components/common';
import ProjectStatusManager from '@/app/admin/projects/details/ProjectStatusManager';

const ProjectDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const projectId = id ? parseInt(id, 10) : undefined;
	const { hasAnyRole } = useAuthContext();
	
	const { project, loading, error, refetch } = useProjectDetails(projectId);

	const isAdmin = hasAnyRole(['Admin', 'SuperAdmin']);

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

	return (
		<>
			<PageBreadcrumb title="Project Details" subName="Projects" />

			<Row>
				<Col xxl={8} lg={6}>
					<Card className="d-block">
						<CardBody>
							<CardTitle
								containerClass="d-flex justify-content-between align-items-center mb-2"
								icon="ri-more-fill"
								title={<h3 className="mt-0">{project.name}</h3>}
								menuItems={menuItems}
							/>
							
							{/* Status Badge and Project Info in one line */}
							<div className="d-flex flex-wrap align-items-center gap-3 mb-3">
								<Badge bg={statusVariant} className="text-light">
									{project.status}
								</Badge>
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
									<Col md={6}>
										<img
											src={project.thumbnailUrl}
											alt={project.name}
											className="img-fluid rounded"
											style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
										/>
									</Col>
									<Col md={6}>
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

							<TeamMembers projectId={project.id} />
						</CardBody>
					</Card>

					<Comments />
				</Col>

				<Col xl={4} lg={6}>
					{isAdmin && (
						<ProjectStatusManager
							projectId={project.id}
							currentStatus={project.status}
							onStatusUpdated={refetch}
						/>
					)}

					<ProgressChart />
					<Files files={project.files} />
				</Col>
			</Row>
		</>
	);
};

export default ProjectDetailsPage;
