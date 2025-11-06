import { Link } from "react-router";
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Badge } from 'react-bootstrap';
import classNames from 'classnames';
import type { ProjectDto } from '@/types/project';
import { getProjectScopeLabel, getStatusBadgeVariant } from '@/utils/projectUtils';
import { useAuthContext } from '@/common/context/useAuthContext';

interface ProjectCardProps {
	project: ProjectDto;
	basePath?: string;
	variant?: 'default' | 'compact';
	onEdit?: (projectId: number) => void;
	onDelete?: (projectId: number) => void;
}

export default function ProjectCard({ 
	project, 
	basePath = '/client/projects',
	variant = 'default', 
	onEdit, 
	onDelete 
}: ProjectCardProps) {
	const { hasAnyRole } = useAuthContext();
	const isProvider = hasAnyRole(['Provider']);
	const hasImage = !!project.thumbnailUrl;
	const statusVariant = getStatusBadgeVariant(project.status);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const handleHistoryClick = () => {
		alert('History feature will be implemented in the future');
	};

	return (
		<Card className="d-block h-100 mb-0">
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
							bg={statusVariant}
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
					<Link to={`${basePath}/details/${project.id}`} className="text-title">
						{project.name}
					</Link>
				</h4>

				{!hasImage && (
					<Badge bg={statusVariant} className="mb-2 align-self-start">
						{project.status}
					</Badge>
				)}

				{project.description && variant !== 'compact' && (
					<p className="text-muted font-13 mb-2">
						{project.description.length > 100 
							? `${project.description.substring(0, 100)}...` 
							: project.description}
					</p>
				)}

				{/* Quote Information - hidden for Provider */}
				{!isProvider && project.quotedAmount && (
					<div className="mb-1">
						<span className="text-muted">
							<i className="mdi mdi-currency-usd me-1"></i>
							{project.status === 'QuoteSubmitted' ? (
								<span className="text-warning">Pending approval</span>
							) : (
								<strong className="text-success">{formatCurrency(project.quotedAmount)}</strong>
							)}
						</span>
					</div>
				)}

				<div className="mb-1">
					<span className="text-muted">
						<i className="mdi mdi-map-marker me-1"></i>
						{project.city}, {project.state}
					</span>
				</div>

				<div className="mb-1">
					<span className="text-muted">
						<i className="mdi mdi-clock-outline me-1"></i>
						Scope: <strong>{getProjectScopeLabel(project.projectScope)}</strong>
					</span>
				</div>

				{project.licenseTypeIds.length > 0 && (
					<div className="mb-1">
						<span className="text-muted">
							<i className="mdi mdi-account-hard-hat me-1"></i>
							{project.licenseTypeIds.length} License Type{project.licenseTypeIds.length > 1 ? 's' : ''}
						</span>
					</div>
				)}

				<div className="mt-auto d-flex justify-content-between align-items-center">
					<div className="d-flex gap-2">
						<Link 
							to={`${basePath}/details/${project.id}`} 
							className="text-muted"
							title="View Details"
						>
							<i className="mdi mdi-eye font-18"></i>
						</Link>
						<button 
							onClick={handleHistoryClick}
							className="btn btn-link text-muted p-0"
							title="History"
						>
							<i className="mdi mdi-history font-18"></i>
						</button>
					</div>
					<span className="text-muted font-13">
						Updated {new Date(project.createdAt).toLocaleDateString()}
					</span>
				</div>
			</CardBody>
		</Card>
	);
}
