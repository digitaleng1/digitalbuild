import { useState } from 'react';
import { Link } from 'react-router';
import { Badge } from 'react-bootstrap';
import type { ProjectDto } from '@/types/project';
import { getStatusBadgeVariant, getProjectScopeShortLabel } from '@/utils/projectUtils';
import { useAuthContext } from '@/common/context/useAuthContext';
import './ProjectTable.css';

interface ProjectTableRowProps {
	project: ProjectDto;
	basePath: string;
	isSelected: boolean;
	onSelect: (selected: boolean) => void;
	onStatusChange?: (newStatus: string) => Promise<void>;
	rowIndex: number;
}

const ProjectTableRow = ({
	project,
	basePath,
	isSelected,
	onSelect,
	rowIndex
}: ProjectTableRowProps) => {
	const { hasAnyRole } = useAuthContext();
	const isAdmin = hasAnyRole(['Admin', 'SuperAdmin']);
	const [isDragging, setIsDragging] = useState(false);

	const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>) => {
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', project.id.toString());
		setIsDragging(true);
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric' 
		});
	};

	// Get initials from client name for fallback avatar
	const getClientInitials = (name?: string) => {
		if (!name) return '?';
		const parts = name.split(' ');
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	const rowBgColor = rowIndex % 2 === 0 ? 'bg-white' : 'bg-light';

	return (
		<tr
			draggable
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			className={`${rowBgColor} ${isDragging ? 'dragging' : ''}`}
		>
			{/* Drag Handle */}
			<td className="drag-handle">
				<i className="mdi mdi-grip-vertical text-muted"></i>
			</td>

			{/* Checkbox */}
			<td className="col-checkbox">
				<input
					type="checkbox"
					className="form-check-input"
					checked={isSelected}
					onChange={(e) => onSelect(e.target.checked)}
					onClick={(e) => e.stopPropagation()}
				/>
			</td>

			{/* Project Name */}
			<td className="col-name">
				<Link 
					to={`${basePath}/details/${project.id}`}
					className="project-name-link"
				>
					{project.name}
				</Link>
			</td>

			{/* Status */}
			<td className="col-status">
				<Badge bg={getStatusBadgeVariant(project.status)} className="px-2 py-1">
					{project.status.replace(/([A-Z])/g, ' $1').trim()}
				</Badge>
			</td>

			{/* Client with Avatar */}
			<td className="col-client">
				{isAdmin && project.clientName ? (
					<div className="d-flex align-items-center">
						{project.clientProfilePictureUrl ? (
							<img 
								src={project.clientProfilePictureUrl}
								alt={project.clientName}
								className="rounded-circle me-2"
								style={{ width: '28px', height: '28px', objectFit: 'cover' }}
							/>
						) : (
							<div 
								className="rounded-circle me-2 d-flex align-items-center justify-content-center bg-primary text-white"
								style={{ width: '28px', height: '28px', fontSize: '11px', fontWeight: 'bold' }}
							>
								{getClientInitials(project.clientName)}
							</div>
						)}
						<span className="text-dark">{project.clientName}</span>
					</div>
				) : (
					<span className="text-muted">N/A</span>
				)}
			</td>

			{/* Location */}
			<td className="col-location">
				<i className="mdi mdi-map-marker text-muted me-1"></i>
				{project.city && project.state ? `${project.city}, ${project.state}` : 'N/A'}
			</td>

			{/* Scope */}
			<td className="col-scope">
				<Badge bg="secondary" className="px-2 py-1">
					{getProjectScopeShortLabel(project.projectScope)}
				</Badge>
			</td>

			{/* Metadata - Task Count */}
			<td className="col-metadata">
				<Link 
					to={isAdmin ? `/admin/projects/tasks/${project.id}` : `/client/projects/tasks/${project.id}`}
					className="text-decoration-none"
					title="View project tasks"
					onClick={(e) => e.stopPropagation()}
				>
					<span className="text-primary d-flex align-items-center">
						<i className="mdi mdi-format-list-checks me-1"></i>
						<strong>{project.taskCount} Tasks</strong>
					</span>
				</Link>
			</td>

			{/* Created Date */}
			<td className="col-date">
				<i className="mdi mdi-calendar text-muted me-1"></i>
				{formatDate(project.createdAt)}
			</td>

			{/* Actions - View Details */}
			<td className="col-actions" onClick={(e) => e.stopPropagation()}>
				<Link 
					to={`${basePath}/details/${project.id}`}
					className="action-link"
					title="View Details"
				>
					<i className="mdi mdi-eye fs-5"></i>
				</Link>
			</td>
		</tr>
	);
};

export default ProjectTableRow;
