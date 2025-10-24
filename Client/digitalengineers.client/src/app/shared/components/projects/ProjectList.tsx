import { Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Link } from "react-router";
import { ProjectCard } from './';
import { LoadingSpinner, EmptyState } from '../common';
import { useProjects } from '../../hooks';

interface ProjectListProps {
	/**
	 * URL for creating new project
	 * Examples:
	 * - Client: '/client/projects/create'
	 * - Admin: '/admin/projects/create'
	 * - Provider: '/provider/projects/create'
	 */
	createProjectUrl: string;
	
	/**
	 * Show/hide "Create Project" button
	 * Default: true
	 */
	showCreateButton?: boolean;
	
	/**
	 * Custom handlers for edit/delete (for Admin role)
	 */
	onEdit?: (projectId: number) => void;
	onDelete?: (projectId: number) => void;
	
	/**
	 * Title for empty state
	 * Default: 'No Projects Yet'
	 */
	emptyTitle?: string;
	
	/**
	 * Description for empty state
	 */
	emptyDescription?: string;
}

/**
 * Shared ProjectList component
 * Used by Client, Admin, Provider roles
 */
export default function ProjectList({
	createProjectUrl,
	showCreateButton = true,
	onEdit,
	onDelete,
	emptyTitle = 'No Projects Yet',
	emptyDescription = "You haven't created any projects yet. Click the button below to create your first project."
}: ProjectListProps) {
	const { projects, loading, error, refetch } = useProjects();

	return (
		<>
			<Row className="mb-2">
				<Col sm={4}>
					{showCreateButton && (
						<Link to={createProjectUrl} className="rounded-pill mb-3 btn btn-danger">
							<i className="mdi mdi-plus"></i> Create Project
						</Link>
					)}
				</Col>
				<Col sm={8}>
					<div className="text-sm-end">
						<div className="btn-group mb-3">
							<Button variant="primary">All</Button>
						</div>
						<ButtonGroup className="mb-3 ms-1">
							<Button variant="light">Active</Button>
							<Button variant="light">Completed</Button>
						</ButtonGroup>

						<ButtonGroup className="mb-3 ms-2 d-none d-sm-inline-block">
							<Button variant="secondary" onClick={refetch}>
								<i className="ri-refresh-line"></i>
							</Button>
						</ButtonGroup>
					</div>
				</Col>
			</Row>

			{/* Loading State */}
			{loading && (
				<LoadingSpinner 
					size="lg" 
					text="Loading projects..." 
					fullScreen 
				/>
			)}

			{/* Error State */}
			{!loading && error && (
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
					actionText={showCreateButton ? "Create Your First Project" : undefined}
					onAction={showCreateButton ? () => window.location.href = createProjectUrl : undefined}
				/>
			)}

			{/* Projects Grid */}
			{!loading && !error && projects && projects.length > 0 && (
				<Row>
					{projects.map((project) => (
						<Col md={6} xxl={3} key={project.id}>
							<ProjectCard 
								project={project}
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
