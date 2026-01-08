import React, { useCallback } from 'react';
import { Badge, Button, Collapse } from 'react-bootstrap';
import LicenseRequirementList from './LicenseRequirementList';
import type { ProfessionTypeManagementDto, LicenseRequirement } from '@/types/lookup';

interface ProfessionTypeRowProps {
	professionType: ProfessionTypeManagementDto;
	licenseRequirements: LicenseRequirement[];
	isExpanded: boolean;
	onToggle: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onAddRequirement: () => void;
	onEditRequirement: (requirement: LicenseRequirement) => void;
	onDeleteRequirement: (requirement: LicenseRequirement) => void;
}

const ProfessionTypeRow: React.FC<ProfessionTypeRowProps> = React.memo(({
	professionType,
	licenseRequirements,
	isExpanded,
	onToggle,
	onEdit,
	onDelete,
	onAddRequirement,
	onEditRequirement,
	onDeleteRequirement,
}) => {
	const handleToggle = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onToggle();
	}, [onToggle]);

	const handleEdit = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onEdit();
	}, [onEdit]);

	const handleDelete = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete();
	}, [onDelete]);

	const handleAddRequirement = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onAddRequirement();
	}, [onAddRequirement]);

	return (
		<div className="border-bottom">
			<div 
				className="d-flex align-items-center justify-content-between py-2 px-3"
				style={{
					cursor: 'pointer',
					//backgroundColor: isExpanded ? '#f8f9fa' : 'transparent'
				}}
				onClick={handleToggle}
			>
				<div className="d-flex align-items-center flex-grow-1">
					<i 
						className={`mdi ${isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'} me-2 text-muted`}
						style={{ fontSize: '1.2rem' }}
					></i>
					<div>
						<div className="d-flex align-items-center flex-wrap gap-2">
							<span className="fw-medium">{professionType.name}</span>
							<Badge bg="info" className="font-monospace">{professionType.code}</Badge>
							{professionType.requiresStateLicense && (
								<Badge bg="warning" text="dark">
									<i className="mdi mdi-information-outline me-1"></i>
									State License
								</Badge>
							)}
							{!professionType.isActive && (
								<Badge bg="secondary">Inactive</Badge>
							)}
						</div>
						{professionType.description && (
							<div className="text-muted small mt-1">{professionType.description}</div>
						)}
					</div>
				</div>
				<div className="d-flex align-items-center gap-2 ms-3">
					<Badge bg="primary" pill>
						{professionType.licenseRequirementsCount} {professionType.licenseRequirementsCount === 1 ? 'license' : 'licenses'}
					</Badge>
					<Button 
						variant="outline-success" 
						size="sm"
						onClick={handleAddRequirement}
						title="Add license requirement"
					>
						<i className="mdi mdi-plus"></i>
					</Button>
					<Button 
						variant="outline-primary" 
						size="sm"
						onClick={handleEdit}
						title="Edit profession type"
					>
						<i className="mdi mdi-pencil"></i>
					</Button>
					<Button 
						variant="outline-danger" 
						size="sm"
						onClick={handleDelete}
						title="Delete profession type"
					>
						<i className="mdi mdi-delete"></i>
					</Button>
				</div>
			</div>
			<Collapse in={isExpanded}>
				<div>
					<div className="bg-light border-top">
						<LicenseRequirementList
							requirements={licenseRequirements}
							onEdit={onEditRequirement}
							onDelete={onDeleteRequirement}
						/>
					</div>
				</div>
			</Collapse>
		</div>
	);
});

ProfessionTypeRow.displayName = 'ProfessionTypeRow';

export default ProfessionTypeRow;
