import { useState, useEffect, useMemo } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ProjectList, ProjectKanbanBoard, ProjectTableView } from '@/app/shared/components/projects';
import ProjectFilters, { type ProjectFiltersData } from './ProjectFilters';
import useProjects from '@/app/shared/hooks/useProjects';
import LoadingSpinner from '@/app/shared/components/common/LoadingSpinner';

type ViewMode = 'cards' | 'list' | 'kanban';

const VIEW_MODE_STORAGE_KEY = 'client-projects-view-mode';

const ListProject = () => {
	const [viewMode, setViewMode] = useState<ViewMode>(() => {
		const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
		return (saved as ViewMode) || 'cards';
	});
	
	const [filters, setFilters] = useState<ProjectFiltersData>({ 
		status: 'All', 
		search: '' 
	});
	
	const { projects, loading, error, updateProjectStatus } = useProjects();

	useEffect(() => {
		localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
	}, [viewMode]);

	const handleFilterChange = (newFilters: ProjectFiltersData) => {
		setFilters(newFilters);
	};

	// Apply filters to all projects
	const filteredProjects = useMemo(() => {
		return projects.filter(project => {
			const matchesStatus = filters.status === 'All' || project.status === filters.status;
			const matchesSearch = !filters.search || 
				project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				project.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
				project.city?.toLowerCase().includes(filters.search.toLowerCase());
			
			return matchesStatus && matchesSearch;
		});
	}, [projects, filters]);

	if (loading) {
		return <LoadingSpinner fullScreen />;
	}

	if (error) {
		return (
			<>
				<PageBreadcrumb title="Project List" subName="Projects" />
				<div className="alert alert-danger">
					<strong>Error:</strong> {error}
				</div>
			</>
		);
	}

	return (
		<>
			<PageBreadcrumb title="Project List" subName="Projects" />

			{/* Unified Filters */}
			<ProjectFilters 
				onFilterChange={handleFilterChange}
				filters={filters}
			/>

			{/* View Mode Switcher and Create Button */}
			<Row className="mb-3">
				<Col className="d-flex justify-content-between align-items-center">
					<Link to="/client/projects/create">
						<Button variant="primary">
							<i className="mdi mdi-plus me-1"></i>
							Create Project
						</Button>
					</Link>
					<ButtonGroup>
						<Button
							variant={viewMode === 'cards' ? 'primary' : 'light'}
							onClick={() => setViewMode('cards')}
							title="Card View"
						>
							<i className="mdi mdi-view-grid"></i>
						</Button>
						<Button
							variant={viewMode === 'list' ? 'primary' : 'light'}
							onClick={() => setViewMode('list')}
							title="List View"
						>
							<i className="mdi mdi-view-list"></i>
						</Button>
						<Button
							variant={viewMode === 'kanban' ? 'primary' : 'light'}
							onClick={() => setViewMode('kanban')}
							title="Kanban Board"
						>
							<i className="mdi mdi-view-column"></i>
						</Button>
					</ButtonGroup>
				</Col>
			</Row>

			{/* Content based on view mode */}
			{viewMode === 'cards' && (
				<ProjectList 
					showCreateButton={false}
					projects={filteredProjects}
					loading={loading}
					error={error}
				/>
			)}

			{viewMode === 'list' && (
				<ProjectTableView
					projects={filteredProjects}
					basePath="/client/projects"
					onProjectStatusChange={updateProjectStatus}
					loading={loading}
				/>
			)}

			{viewMode === 'kanban' && (
				<Row>
					<Col>
						<ProjectKanbanBoard
							projects={filteredProjects}
							onProjectStatusChange={updateProjectStatus}
						/>
					</Col>
				</Row>
			)}
		</>
	);
};

export default ListProject;
