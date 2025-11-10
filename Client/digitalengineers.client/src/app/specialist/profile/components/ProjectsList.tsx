import { Card, CardBody, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CardTitle from '@/components/CardTitle';
import type { AssignedProject } from '@/types/specialist';
import { getStatusBadgeVariant } from '@/utils/projectUtils';

interface ProjectsListProps {
	projects: AssignedProject[];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Assigned Projects"
					icon="mdi mdi-briefcase"
				/>

				{!projects || projects.length === 0 ? (
					<Alert variant="info" className="mb-0">
						<i className="mdi mdi-information-outline me-2"></i>
						No projects assigned yet
					</Alert>
				) : (
					<div className="table-responsive">
						<table className="table table-hover table-centered mb-0">
							<thead>
								<tr>
									<th>Project Name</th>
									<th>Role</th>
									<th>Status</th>
									<th>Assigned At</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{projects.map((project) => (
									<tr key={project.projectId}>
										<td>
											<Link to={`/specialist/projects/${project.projectId}`}>
												{project.projectName}
											</Link>
										</td>
										<td>{project.role || 'N/A'}</td>
										<td>
											<Badge bg={getStatusBadgeVariant(project.status)}>
												{project.status}
											</Badge>
										</td>
										<td>{new Date(project.assignedAt).toLocaleDateString()}</td>
										<td>
											<Link
												to={`/specialist/projects/${project.projectId}`}
												className="btn btn-sm btn-primary"
											>
												<i className="mdi mdi-eye me-1"></i>
												View
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</CardBody>
		</Card>
	);
};

export default ProjectsList;
