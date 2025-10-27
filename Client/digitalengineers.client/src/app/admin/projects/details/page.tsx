import { Row, Col, Card, CardBody, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import TeamMembers from '@/app/client/projects/details/TeamMembers';
import Comments from '@/app/client/projects/details/Comments';
import ProgressChart from '@/app/client/projects/details/ProgressChart';
import Files from '@/app/client/projects/details/Files';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import CardTitle from '@/components/CardTitle';
import { useProjectDetails } from '@/app/shared/hooks';
import { getProjectScopeLabel, getStatusBadgeVariant } from '@/utils/projectUtils';
import ProjectStatusManager from './ProjectStatusManager';

const AdminProjectDetails = () => {
	const { id } = useParams<{ id: string }>();
	const projectId = id ? parseInt(id, 10) : undefined;
	
	const { project, loading, error, refetch } = useProjectDetails(projectId);

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="Project Details" subName="Admin" />
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
				<PageBreadcrumb title="Project Details" subName="Admin" />
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

	return (
		<>
			<PageBreadcrumb title={project.name} subName="Admin" />

			<Row>
				<Col xxl={8} lg={6}>
					<Card className="d-block">
						<CardBody>
							<CardTitle
								containerClass="d-flex justify-content-between align-items-center mb-2"
								icon="ri-more-fill"
								title={<h3 className="mt-0">{project.name}</h3>}
								menuItems={[
									{ label: 'View as Client', icon: 'mdi mdi-eye' },
									{ label: 'Assign Provider', icon: 'mdi mdi-account-plus' },
									{ label: 'Project History', icon: 'mdi mdi-history' },
								]}
							/>
							<Badge bg={statusVariant} className="text-light mb-3">
								{project.status}
							</Badge>

							{project.thumbnailUrl && (
								<div className="mb-3">
									<img
										src={project.thumbnailUrl}
										alt={project.name}
										className="img-fluid rounded"
										style={{ maxHeight: '300px', objectFit: 'cover' }}
									/>
								</div>
							)}

							<h5>Client Information:</h5>
							<p className="text-muted mb-4">
								<strong>Client ID:</strong> {project.clientId}
							</p>

							<h5>Project Overview:</h5>
							<p className="text-muted mb-4">{project.description}</p>

							<h5>Project Location:</h5>
							<p className="text-muted mb-4">
								{project.streetAddress}
								<br />
								{project.city}, {project.state} {project.zipCode}
							</p>

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

							<Row>
								<Col md={4}>
									<div className="mb-4">
										<h5>Created Date</h5>
										<p className="text-muted">{createdDate}</p>
									</div>
								</Col>
								<Col md={4}>
									<div className="mb-4">
										<h5>Last Updated</h5>
										<p className="text-muted">{updatedDate}</p>
									</div>
								</Col>
								<Col md={4}>
									<div className="mb-4">
										<h5>Project Scope</h5>
										<p className="text-muted">{scopeLabel}</p>
									</div>
								</Col>
							</Row>

							<TeamMembers />
						</CardBody>
					</Card>

					<Comments />
				</Col>

				<Col xl={4} lg={6}>
					<ProjectStatusManager 
						projectId={project.id}
						currentStatus={project.status}
						onStatusUpdated={refetch}
					/>
					<ProgressChart />
					<Files files={project.files} />
				</Col>
			</Row>
		</>
	);
};

export default AdminProjectDetails;
