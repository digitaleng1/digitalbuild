import { Row, Col } from 'react-bootstrap';
import { Link } from "react-router";
import { ProjectCard } from './';
import { LoadingSpinner, EmptyState } from '../common';
import type { ProjectDto } from '@/types/project';

interface ProjectListProps {
	basePath?: string;
	createProjectUrl?: string;
	showCreateButton?: boolean;
	projects?: ProjectDto[];
	loading?: boolean;
	error?: string | null;
	onEdit?: (projectId: number) => void;
	onDelete?: (projectId: number) => void;
	emptyTitle?: string;
	emptyDescription?: string;
}

export default function ProjectList({
	basePath = '/client/projects',
	createProjectUrl,
	showCreateButton = true,
	projects = [],
	loading = false,
	error = null,
	onEdit,
	onDelete,
	emptyTitle = 'No Projects Yet',
	emptyDescription = "You haven't created any projects yet. Click the button below to create your first project."
}: ProjectListProps) {
	if (loading) {
		return <LoadingSpinner size="lg" text="Loading projects..." fullScreen />;
	}

	if (error) {
		return (
			<div className="alert alert-danger">
				<strong>Error:</strong> {error}
			</div>
		);
	}

	if (projects.length === 0) {
		return (
			<>
				{showCreateButton && createProjectUrl && (
					<Row className="mb-2">
						<Col sm={4}>
							<Link to={createProjectUrl} className="rounded-pill mb-3 btn btn-danger">
								<i className="mdi mdi-plus"></i> Create Project
							</Link>
						</Col>
					</Row>
				)}
				<EmptyState
					icon="mdi mdi-briefcase-outline"
					title={emptyTitle}
					description={emptyDescription}
					actionText={showCreateButton && createProjectUrl ? "Create Your First Project" : undefined}
					onAction={showCreateButton && createProjectUrl ? () => window.location.href = createProjectUrl : undefined}
				/>
			</>
		);
	}

	return (
		<>
			{showCreateButton && createProjectUrl && (
				<Row className="mb-2">
					<Col sm={4}>
						<Link to={createProjectUrl} className="rounded-pill mb-3 btn btn-danger">
							<i className="mdi mdi-plus"></i> Create Project
						</Link>
					</Col>
				</Row>
			)}
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
		</>
	);
}
