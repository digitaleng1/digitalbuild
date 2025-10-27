import { useState, useMemo } from 'react';
import { Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Link } from "react-router";
import { ProjectCard } from './';
import { LoadingSpinner, EmptyState } from '../common';
import { useProjects } from '../../hooks';
import ProjectFilters, { type ProjectFiltersData } from '@/app/admin/projects/list/ProjectFilters';

interface ProjectListProps {
	/**
	 * Base path for project navigation
	 * Examples:
	 * - Client: '/client/projects'
	 * - Admin: '/admin/projects'
	 * Default: '/client/projects'
	 */
	basePath?: string;
	
	/**
	 * URL for creating new project
	 * Examples:
	 * - Client: '/client/projects/create'
	 */
	createProjectUrl?: string;
	
	/**
	 * Show/hide "Create Project" button
	 * Default: true
	 */
	showCreateButton?: boolean;
	
	/**
	 * Show/hide filters (for Admin)
	 * Default: false
	 */
	showFilters?: boolean;
	
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
	basePath = '/client/projects',
	createProjectUrl,
	showCreateButton = true,
	showFilters = false,
	onEdit,
	onDelete,
	emptyTitle = 'No Projects Yet',
	emptyDescription = "You haven't created any projects yet. Click the button below to create your first project."
}: ProjectListProps) {
	const { projects, loading, error, refetch } = useProjects();
	const [filters, setFilters] = useState<ProjectFiltersData>({ status: 'All', search: '' });

	// Фильтрация проектов на клиенте
	const filteredProjects = useMemo(() => {
		if (!projects) return [];
		
		let result = [...projects];
		
		// Фильтр по статусу
		if (filters.status !== 'All') {
			result = result.filter(p => p.status === filters.status);
		}
		
		// Поиск по имени проекта или clientId
		if (filters.search.trim()) {
			const searchLower = filters.search.toLowerCase().trim();
			result = result.filter(p => 
				p.name.toLowerCase().includes(searchLower) ||
				(p.clientId && p.clientId.toLowerCase().includes(searchLower))
			);
		}
		
		return result;
	}, [projects, filters]);

	const handleFilterChange = (newFilters: ProjectFiltersData) => {
		setFilters(newFilters);
	};

	return (
		<>
			{/* Filters for Admin */}
			{showFilters && (
				<ProjectFilters onFilterChange={handleFilterChange} />
			)}

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
						<Col md={6} xxl={3} key={project.id}>
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
