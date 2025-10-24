import { Link } from "react-router";
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Badge, Button } from 'react-bootstrap';
import classNames from 'classnames';
import type { ProjectDto } from '@/types/project';
import { getProjectScopeLabel } from '@/utils/projectUtils';

interface ProjectCardProps {
	project: ProjectDto;
	variant?: 'default' | 'compact';
	onEdit?: (projectId: number) => void;
	onDelete?: (projectId: number) => void;
}

export default function ProjectCard({ project, variant = 'default', onEdit, onDelete }: ProjectCardProps) {
	const hasImage = !!project.thumbnailUrl;

	const getStatusVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case 'completed':
				return 'success';
			case 'inprogress':
			case 'active':
				return 'primary';
			case 'draft':
				return 'secondary';
			case 'cancelled':
				return 'danger';
			default:
				return 'info';
		}
	};

	return (
		<Card className="d-block h-100">
			{hasImage && (
				<>
					<img 
						className="card-img-top" 
						src={project.thumbnailUrl} 
						alt={project.name}
						style={{ height: '186px', objectFit: 'cover' }}
					/>
					<div className="card-img-overlay">
						<Badge 
							bg={getStatusVariant(project.status)}
							className="p-1"
						>
							{project.status}
						</Badge>
					</div>
				</>
			)}

			<CardBody className={classNames(hasImage ? 'position-relative' : '', 'd-flex flex-column')}>
				{!hasImage && (onEdit || onDelete) && (
					<Dropdown className="card-widgets" align="end">
						<DropdownToggle variant="link" as="a" className="card-drop arrow-none cursor-pointer p-0 shadow-none">
							<i className="ri-more-fill"></i>
						</DropdownToggle>

						<DropdownMenu>
							{onEdit && (
								<DropdownItem onClick={() => onEdit(project.id)}>
									<i className="mdi mdi-pencil me-1"></i>Edit
								</DropdownItem>
							)}
							{onDelete && (
								<DropdownItem onClick={() => onDelete(project.id)}>
									<i className="mdi mdi-delete me-1"></i>Delete
								</DropdownItem>
							)}
						</DropdownMenu>
					</Dropdown>
				)}

				<h4 className="mt-0">
					<Link to={`/client/projects/details/${project.id}`} className="text-title">
						{project.name}
					</Link>
				</h4>

				{!hasImage && (
					<Badge bg={getStatusVariant(project.status)} className="mb-2 align-self-start">
						{project.status}
					</Badge>
				)}

				{project.description && variant !== 'compact' && (
					<p className="text-muted font-13 mb-3">
						{project.description.length > 100 
							? `${project.description.substring(0, 100)}...` 
							: project.description}
					</p>
				)}

				<div className="mb-2">
					<span className="text-muted">
						<i className="mdi mdi-map-marker me-1"></i>
						{project.city}, {project.state}
					</span>
				</div>

				<div className="mb-2">
					<span className="text-muted">
						<i className="mdi mdi-clock-outline me-1"></i>
						Scope: <strong>{getProjectScopeLabel(project.projectScope)}</strong>
					</span>
				</div>

				{project.licenseTypeIds.length > 0 && (
					<div className="mb-2">
						<span className="text-muted">
							<i className="mdi mdi-account-hard-hat me-1"></i>
							{project.licenseTypeIds.length} License Type{project.licenseTypeIds.length > 1 ? 's' : ''}
						</span>
					</div>
				)}

				<div className="text-muted font-13 mb-3">
					<i className="mdi mdi-calendar me-1"></i>
					{new Date(project.createdAt).toLocaleDateString()}
				</div>

				<div className="mt-auto">
					<Link 
						to={`/client/projects/details/${project.id}`} 
						className="btn btn-primary btn-sm w-100"
					>
						<i className="mdi mdi-eye me-1"></i>
						View Details
					</Link>
				</div>
			</CardBody>
		</Card>
	);
}
