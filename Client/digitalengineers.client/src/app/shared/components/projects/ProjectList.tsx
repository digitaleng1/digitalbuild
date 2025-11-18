import { Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Link } from "react-router";
import { ProjectCard } from './';
import { LoadingSpinner, EmptyState } from '../common';
import { useProjects } from '../../hooks';
import type { ProjectDto } from '@/types/project';

interface ProjectListProps {
	basePath?: string;
	createProjectUrl?: string;
	showCreateButton?: boolean;
	projects?: ProjectDto[];
	onEdit?: (projectId: number) => void;
	onDelete?: (projectId: number) => void;
	emptyTitle?: string;
	emptyDescription?: string;
}

/**
 * Shared ProjectList component
 * Used by Client, Admin, Provider roles
 */
export default function ProjectList({
	basePath = '/client/projects',
	createProjectUrl,
	showCreateButton = true,
	projects: externalProjects,
	onEdit,
	onDelete,
	emptyTitle = 'No Projects Yet',
	emptyDescription = "You haven't created any projects yet. Click the button below to create your first project."
}: ProjectListProps) {
	const { projects: fetchedProjects, loading, error, refetch } = useProjects();
	
	const projects = externalProjects ?? fetchedProjects;

	return (
		<>
			<Row className="mb-2">
				<Col sm={4}>
					{showCreateButton && createProjectUrl && (
						<Link to={createProjectUrl} className="rounded-pill mb-3 btn btn-danger">
							<i className="mdi mdi-plus"></i> Create Project
						</Link>
					)}
				</Col>
				<Col sm={8}>
					<div className="text-sm-end">
						<ButtonGroup className="mb-3 ms-2 d-none d-sm-inline-block">
							<Button variant="secondary" onClick={refetch}>
								<i className="ri-refresh-line"></i>
							</Button>
						</ButtonGroup>
					</div>
				</Col>
			</Row>

			{/* Loading State */}
			{!externalProjects && loading && (
				<LoadingSpinner 
					size="lg" 
					text="Loading projects..." 
					fullScreen 
				/>
			)}

			{/* Error State */}
			{!externalProjects && !loading && error && (
				<Alert variant="danger" dismissible onClose={refetch}>
					<Alert.Heading>Error Loading Projects</Alert.Heading>
					<p>{error}</p>
					<Button variant="outline-danger" size="sm" onClick={refetch}>
						<i className="mdi mdi-refresh me-1"></i>
						Try Again
					</Button>
				</Alert>
			)}

			{/* Empty State */}
			{!loading && !error && (!projects || projects.length === 0) && (
				<EmptyState
					icon="mdi mdi-briefcase-outline"
					title={emptyTitle}
					description={emptyDescription}
					actionText={showCreateButton && createProjectUrl ? "Create Your First Project" : undefined}
					onAction={showCreateButton && createProjectUrl ? () => window.location.href = createProjectUrl : undefined}
				/>
			)}

			{/* Projects Grid */}
			{!loading && !error && projects && projects.length > 0 && (
				<Row>
					{projects.map((project) => (
						<Col className="mb-2" md={6} xxl={3} key={project.id}>
							<ProjectCard 
								project={project}
								basePath={basePath}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						</Col>
					))}
				</Row>
			)}
		</>
	);
}
