import { useState } from 'react';
import { Table } from 'react-bootstrap';
import type { ProjectDto } from '@/types/project';
import { ProjectStatus } from '@/types/project';
import ProjectTableRow from './ProjectTableRow';
import './ProjectTable.css';

interface ProjectStatusGroupProps {
	status: ProjectStatus;
	projects: ProjectDto[];
	basePath: string;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onProjectStatusChange?: (projectId: number, newStatus: string) => Promise<void>;
	selectedIds: Set<number>;
	onSelectProject: (id: number, selected: boolean) => void;
	onSelectAll: (selected: boolean) => void;
}

const statusGroupColors: Record<ProjectStatus, { bg: string; color: string }> = {
	[ProjectStatus.Draft]: { bg: 'rgb(248, 250, 252)', color: 'rgb(51, 65, 85)' },
	[ProjectStatus.QuotePending]: { bg: 'rgb(240, 249, 255)', color: 'rgb(3, 105, 161)' },
	[ProjectStatus.QuoteSubmitted]: { bg: 'rgb(240, 253, 244)', color: 'rgb(21, 128, 61)' },
	[ProjectStatus.QuoteAccepted]: { bg: 'rgb(240, 253, 244)', color: 'rgb(21, 128, 61)' },
	[ProjectStatus.QuoteRejected]: { bg: 'rgb(254, 242, 242)', color: 'rgb(153, 27, 27)' },
	[ProjectStatus.InitialPaymentPending]: { bg: 'rgb(255, 251, 235)', color: 'rgb(180, 83, 9)' },
	[ProjectStatus.InitialPaymentComplete]: { bg: 'rgb(236, 253, 245)', color: 'rgb(5, 150, 105)' },
	[ProjectStatus.InProgress]: { bg: 'rgb(238, 242, 255)', color: 'rgb(67, 56, 202)' },
	[ProjectStatus.Completed]: { bg: 'rgb(247, 254, 231)', color: 'rgb(77, 124, 15)' },
	[ProjectStatus.Cancelled]: { bg: 'rgb(254, 242, 242)', color: 'rgb(153, 27, 27)' }
};

const ProjectStatusGroup = ({
	status,
	projects,
	basePath,
	isExpanded,
	onToggleExpand,
	onProjectStatusChange,
	selectedIds,
	onSelectProject,
	onSelectAll
}: ProjectStatusGroupProps) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const colors = statusGroupColors[status];

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		setIsDragOver(true);
	};

	const handleDragLeave = () => {
		setIsDragOver(false);
	};

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
		
		const projectId = parseInt(e.dataTransfer.getData('text/plain'));
		const newStatus = status;
		
		if (onProjectStatusChange) {
			await onProjectStatusChange(projectId, newStatus);
		}
	};

	const allSelected = projects.length > 0 && projects.every(p => selectedIds.has(p.id));
	const someSelected = projects.some(p => selectedIds.has(p.id)) && !allSelected;

	return (
		<div 
			className="mb-4"
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{/* Group Header */}
			<div
				className="d-flex align-items-center justify-content-between p-2 rounded-top"
				style={{
					backgroundColor: colors.bg,
					borderLeft: isDragOver ? `4px solid ${colors.color}` : `4px solid transparent`,
					color: colors.color,
					cursor: 'pointer',
					transition: 'all 0.2s'
				}}
				onClick={onToggleExpand}
			>
				<div className="d-flex align-items-center">
					<i 
						className={`mdi ${isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'} fs-4 me-2`}
					></i>
					<h5 className="mb-0 fw-semibold">
						{status.replace(/([A-Z])/g, ' $1').trim()}
					</h5>
					<span className="badge bg-light text-dark ms-3">
						{projects.length}
					</span>
				</div>
				
				{projects.length > 0 && (
					<input
						type="checkbox"
						className="form-check-input"
						checked={allSelected}
						ref={input => {
							if (input) input.indeterminate = someSelected;
						}}
						onChange={(e) => {
							e.stopPropagation();
							onSelectAll(e.target.checked);
						}}
						onClick={(e) => e.stopPropagation()}
					/>
				)}
			</div>

			{/* Group Content */}
			{isExpanded && (
				<div className="border border-top-0 rounded-bottom">
					{projects.length === 0 ? (
						<div className="text-center text-muted py-4">
							<i className="mdi mdi-folder-open-outline fs-2 mb-2"></i>
							<p className="mb-0">No projects in this status</p>
						</div>
					) : (
						<Table className="mb-0 project-table" hover responsive>
							<thead className="table-light">
								<tr>
									<th className="drag-handle"></th>
									<th className="col-checkbox"></th>
									<th className="col-name">Project Name</th>
									<th className="col-status">Status</th>
									<th className="col-client">Client</th>
									<th className="col-location">Location</th>
									<th className="col-scope">Scope</th>
									<th className="col-date">Created</th>
									<th className="col-actions"></th>
								</tr>
							</thead>
							<tbody>
								{projects.map((project, index) => (
									<ProjectTableRow
										key={project.id}
										project={project}
										basePath={basePath}
										isSelected={selectedIds.has(project.id)}
										onSelect={(selected) => onSelectProject(project.id, selected)}
										rowIndex={index}
									/>
								))}
							</tbody>
						</Table>
					)}
				</div>
			)}
		</div>
	);
};

export default ProjectStatusGroup;
