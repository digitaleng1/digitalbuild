import { useMemo } from 'react';
import { Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Link } from "react-router";
import { ProjectCard } from './';
import { LoadingSpinner, EmptyState } from '../common';
import { useProjects } from '../../hooks';
import type { ProjectDto } from '@/types/project';

interface ProjectFiltersData {
	status: string;
	search: string;
}

interface ProjectListProps {
	basePath?: string;
	createProjectUrl?: string;
	showCreateButton?: boolean;
	showFilters?: boolean;
	filters?: ProjectFiltersData;
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
	showFilters = false,
	filters = { status: 'All', search: '' },
	projects: externalProjects,
	onEdit,
	onDelete,
	emptyTitle = 'No Projects Yet',
	emptyDescription = "You haven't created any projects yet. Click the button below to create your first project."
}: ProjectListProps) {
	const { projects: fetchedProjects, loading, error, refetch } = useProjects();
	
	const projects = externalProjects ?? fetchedProjects;

	const filteredProjects = useMemo(() => {
		if (!projects) return [];
		
		let result = [...projects];
		
		if (filters.status !== 'All') {
			result = result.filter(p => p.status === filters.status);
		}
		
		if (filters.search.trim()) {
			const searchLower = filters.search.toLowerCase().trim();
			result = result.filter(p => 
				p.name.toLowerCase().includes(searchLower) ||
				(p.clientId && p.clientId.toLowerCase().includes(searchLower))
			);
		}
		
		return result;
	}, [projects, filters]);

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
						{!showFilters && (
							<>
								<div className="btn-group mb-3">
									<Button variant="primary">All</Button>
								</div>
								<ButtonGroup className="mb-3 ms-1">
									<Button variant="light">Active</Button>
									<Button variant="light">Completed</Button>
								</ButtonGroup>
							</>
						)}

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
			{!loading && !error && (!filteredProjects || filteredProjects.length === 0) && (
				<EmptyState
					icon="mdi mdi-briefcase-outline"
					title={filters.status !== 'All' || filters.search ? 'No Projects Found' : emptyTitle}
					description={filters.status !== 'All' || filters.search ? 'Try adjusting your filters' : emptyDescription}
					actionText={showCreateButton && createProjectUrl && !filters.search && filters.status === 'All' ? "Create Your First Project" : undefined}
					onAction={showCreateButton && createProjectUrl ? () => window.location.href = createProjectUrl : undefined}
				/>
			)}

			{/* Projects Grid */}
			{!loading && !error && filteredProjects && filteredProjects.length > 0 && (
				<Row>
					{filteredProjects.map((project) => (
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
