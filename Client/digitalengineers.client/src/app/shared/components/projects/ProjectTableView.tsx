import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import type { ProjectDto } from '@/types/project';
import { ProjectStatus } from '@/types/project';
import ProjectStatusGroup from './ProjectStatusGroup';
import useUpdateProjectStatus from '@/app/shared/hooks/useUpdateProjectStatus';

interface ProjectTableViewProps {
	projects: ProjectDto[];
	basePath: string;
	onProjectStatusChange?: (projectId: number, newStatus: string) => void;
	loading?: boolean;
}

type SortColumn = 'name' | 'status' | 'clientId' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const EXPANDED_GROUPS_STORAGE_KEY = 'admin-projects-expanded-groups';

const ProjectTableView = ({
	projects,
	basePath,
	onProjectStatusChange,
	loading = false
}: ProjectTableViewProps) => {
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const [sortConfig, setSortConfig] = useState<{
		column: SortColumn;
		direction: SortDirection;
	} | null>(null);

	const { updateStatus } = useUpdateProjectStatus();

	// Load expanded groups from localStorage, default to only QuotePending
	const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
		const saved = localStorage.getItem(EXPANDED_GROUPS_STORAGE_KEY);
		if (saved) {
			try {
				return new Set(JSON.parse(saved));
			} catch {
				return new Set([ProjectStatus.QuotePending]);
			}
		}
		return new Set([ProjectStatus.QuotePending]);
	});

	// Save expanded groups to localStorage
	useEffect(() => {
		localStorage.setItem(EXPANDED_GROUPS_STORAGE_KEY, JSON.stringify([...expandedGroups]));
	}, [expandedGroups]);

	const toggleGroup = (status: string) => {
		setExpandedGroups(prev => {
			const newSet = new Set(prev);
			if (newSet.has(status)) {
				newSet.delete(status);
			} else {
				newSet.add(status);
			}
			return newSet;
		});
	};

	const expandAll = () => {
		setExpandedGroups(new Set(Object.values(ProjectStatus)));
	};

	const collapseAll = () => {
		setExpandedGroups(new Set());
	};

	const handleSelectProject = (id: number, selected: boolean) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (selected) {
				newSet.add(id);
			} else {
				newSet.delete(id);
			}
			return newSet;
		});
	};

	const handleSelectAllInGroup = (groupProjects: ProjectDto[], selected: boolean) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			groupProjects.forEach(p => {
				if (selected) {
					newSet.add(p.id);
				} else {
					newSet.delete(p.id);
				}
			});
			return newSet;
		});
	};

	const handleSort = (column: SortColumn) => {
		setSortConfig(current => {
			if (current?.column === column) {
				return {
					column,
					direction: current.direction === 'asc' ? 'desc' : 'asc'
				};
			}
			return { column, direction: 'asc' };
		});
	};

	const handleProjectStatusChange = async (projectId: number, newStatus: string) => {
		try {
			await updateStatus(projectId, newStatus);
			
			// Update parent state
			if (onProjectStatusChange) {
				onProjectStatusChange(projectId, newStatus);
			}
		} catch (error) {
			// Error already handled by useUpdateProjectStatus
			throw error;
		}
	};

	// Sort projects (pre-filtered by parent)
	const sortedProjects = useMemo(() => {
		let result = [...projects];

		// Sort
		if (sortConfig) {
			result.sort((a, b) => {
				let aValue: any;
				let bValue: any;

				switch (sortConfig.column) {
					case 'name':
						aValue = a.name.toLowerCase();
						bValue = b.name.toLowerCase();
						break;
					case 'status':
						aValue = a.status;
						bValue = b.status;
						break;
					case 'clientId':
						aValue = a.clientId || '';
						bValue = b.clientId || '';
						break;
					case 'createdAt':
						aValue = new Date(a.createdAt).getTime();
						bValue = new Date(b.createdAt).getTime();
						break;
					default:
						return 0;
				}

				if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return result;
	}, [projects, sortConfig]);

	// Group projects by status
	const groupedProjects = useMemo(() => {
		const groups = new Map<ProjectStatus, ProjectDto[]>();

		Object.values(ProjectStatus).forEach(status => {
			groups.set(status, []);
		});

		sortedProjects.forEach(project => {
			const status = project.status as ProjectStatus;
			if (groups.has(status)) {
				groups.get(status)!.push(project);
			}
		});

		return groups;
	}, [sortedProjects]);

	const clearSelection = () => {
		setSelectedIds(new Set());
	};

	return (
		<>
			{/* Toolbar */}
			<Row className="mb-3">
				<Col className="d-flex justify-content-end">
					<ButtonGroup>
						<Button variant="light" size="sm" onClick={expandAll}>
							<i className="mdi mdi-arrow-expand-all me-1"></i>
							Expand All
						</Button>
						<Button variant="light" size="sm" onClick={collapseAll}>
							<i className="mdi mdi-arrow-collapse-all me-1"></i>
							Collapse All
						</Button>
					</ButtonGroup>
				</Col>
			</Row>

			{/* Bulk Selection Toolbar */}
			{selectedIds.size > 0 && (
				<Row className="mb-3">
					<Col>
						<div className="alert alert-info d-flex align-items-center justify-content-between">
							<span>
								<i className="mdi mdi-checkbox-multiple-marked me-2"></i>
								{selectedIds.size} project{selectedIds.size > 1 ? 's' : ''} selected
							</span>
							<div>
								<Button variant="primary" size="sm" className="me-2">
									<i className="mdi mdi-file-export me-1"></i>
									Export
								</Button>
								<Button variant="light" size="sm" onClick={clearSelection}>
									Clear Selection
								</Button>
							</div>
						</div>
					</Col>
				</Row>
			)}

			{/* Sort Info */}
			{sortConfig && (
				<Row className="mb-2">
					<Col>
						<small className="text-muted">
							Sorted by {sortConfig.column} ({sortConfig.direction})
							<Button
								variant="link"
								size="sm"
								className="p-0 ms-2"
								onClick={() => setSortConfig(null)}
							>
								Clear Sort
							</Button>
						</small>
					</Col>
				</Row>
			)}

			{/* Status Groups */}
			{loading ? (
				<div className="text-center py-5">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			) : (
				<>
					{sortedProjects.length === 0 ? (
						<div className="text-center py-5">
							<i className="mdi mdi-folder-open-outline fs-1 text-muted"></i>
							<p className="text-muted mt-2">No projects found</p>
						</div>
					) : (
						Object.values(ProjectStatus).map(status => {
							const statusProjects = groupedProjects.get(status) || [];
							if (statusProjects.length === 0) {
								return null;
							}

							return (
								<ProjectStatusGroup
									key={status}
									status={status}
									projects={statusProjects}
									basePath={basePath}
									isExpanded={expandedGroups.has(status)}
									onToggleExpand={() => toggleGroup(status)}
									onProjectStatusChange={handleProjectStatusChange}
									selectedIds={selectedIds}
									onSelectProject={handleSelectProject}
									onSelectAll={(selected) => handleSelectAllInGroup(statusProjects, selected)}
								/>
							);
						})
					)}
				</>
			)}
		</>
	);
};

export default ProjectTableView;
