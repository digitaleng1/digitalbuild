import { useState, useEffect, useMemo } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ProjectList, ProjectKanbanBoard } from '@/app/shared/components/projects';
import ProjectFilters, { type ProjectFiltersData } from './ProjectFilters';
import useProjects from '@/app/shared/hooks/useProjects';
import LoadingSpinner from '@/app/shared/components/common/LoadingSpinner';
import { ProjectStatus } from '@/types/project';

type ViewMode = 'cards' | 'kanban';

const VIEW_MODE_STORAGE_KEY = 'admin-projects-view-mode';

const AdminProjectsManagement = () => {
	const [viewMode, setViewMode] = useState<ViewMode>(() => {
		const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
		return (saved as ViewMode) || 'kanban';
	});
	
	const [filters, setFilters] = useState<ProjectFiltersData>({ status: 'All', search: '' });
	const { projects, loading, error, updateProjectStatus } = useProjects();

	useEffect(() => {
		localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
	}, [viewMode]);

	const handleFilterChange = (newFilters: ProjectFiltersData) => {
		setFilters(newFilters);
	};

	const filteredProjects = useMemo(() => {
		return projects.filter(project => {
			const matchesStatus = filters.status === 'All' || project.status === filters.status;
			const matchesSearch = !filters.search || 
				project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				project.description?.toLowerCase().includes(filters.search.toLowerCase());
			
			return matchesStatus && matchesSearch;
		});
	}, [projects, filters]);

	if (loading) {
		return <LoadingSpinner fullScreen />;
	}

	if (error) {
		return (
			<>
				<PageBreadcrumb title="Projects Management" subName="Admin" />
				<div className="alert alert-danger">
					<strong>Error:</strong> {error}
				</div>
			</>
		);
	}

	return (
		<>
			<PageBreadcrumb title="Projects Management" subName="Admin" />

			{/* Filters */}
			<ProjectFilters onFilterChange={handleFilterChange} />

			{/* View Mode Switcher */}
			<Row className="mb-3">
				<Col className="d-flex justify-content-end">
					<ButtonGroup>
						<Button
							variant={viewMode === 'cards' ? 'secondary' : 'light'}
							onClick={() => setViewMode('cards')}
							title="Card View"
						>
							<i className="mdi mdi-view-grid"></i>
						</Button>
						<Button
							variant={viewMode === 'kanban' ? 'secondary' : 'light'}
							onClick={() => setViewMode('kanban')}
							title="Kanban Board"
						>
							<i className="mdi mdi-view-column"></i>
						</Button>
					</ButtonGroup>
				</Col>
			</Row>

			{/* Content based on view mode */}
			{viewMode === 'cards' ? (
				<ProjectList
					basePath="/admin/projects"
					showCreateButton={false}
					showFilters={false}
					projects={filteredProjects}
				/>
			) : (
				<Row>
					<Col>
						<ProjectKanbanBoard
							projects={filteredProjects}
							onProjectStatusChange={updateProjectStatus}
							basePath="/admin/projects"
						/>
					</Col>
				</Row>
			)}
		</>
	);
};

export default AdminProjectsManagement;
