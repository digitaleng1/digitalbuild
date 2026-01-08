import React, { useCallback } from 'react';
import { Badge, Button, Collapse } from 'react-bootstrap';
import ProfessionTypeRow from './ProfessionTypeRow';
import type { ProfessionManagementDto, ProfessionTypeManagementDto, LicenseRequirement } from '@/types/lookup';

interface ProfessionRowProps {
	profession: ProfessionManagementDto;
	professionTypes: ProfessionTypeManagementDto[];
	licenseRequirements: Map<number, LicenseRequirement[]>;
	isExpanded: boolean;
	expandedTypeIds: Set<number>;
	onToggle: () => void;
	onToggleType: (typeId: number) => void;
	onEdit: () => void;
	onDelete: () => void;
	onAddType: () => void;
	onEditType: (professionType: ProfessionTypeManagementDto) => void;
	onDeleteType: (professionType: ProfessionTypeManagementDto) => void;
	onAddRequirement: (professionType: ProfessionTypeManagementDto) => void;
	onEditRequirement: (professionType: ProfessionTypeManagementDto, requirement: LicenseRequirement) => void;
	onDeleteRequirement: (professionType: ProfessionTypeManagementDto, requirement: LicenseRequirement) => void;
}

const ProfessionRow: React.FC<ProfessionRowProps> = React.memo(({
	profession,
	professionTypes,
	licenseRequirements,
	isExpanded,
	expandedTypeIds,
	onToggle,
	onToggleType,
	onEdit,
	onDelete,
	onAddType,
	onEditType,
	onDeleteType,
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

	const handleAddType = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onAddType();
	}, [onAddType]);

	return (
		<div className="border rounded mb-2">
			<div 
				className="d-flex align-items-center justify-content-between py-3 px-3"
				style={{ 
					cursor: 'pointer', 
					//backgroundColor: isExpanded ? '#e9ecef' : '#f8f9fa',
					borderRadius: isExpanded ? '0.25rem 0.25rem 0 0' : '0.25rem'
				}}
				onClick={handleToggle}
			>
				<div className="d-flex align-items-center flex-grow-1">
					<i 
						className={`mdi ${isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'} me-2`}
						style={{ fontSize: '1.4rem' }}
					></i>
					<div>
						<div className="d-flex align-items-center flex-wrap gap-2">
							<strong className="fs-5">{profession.name}</strong>
							<Badge bg="secondary" className="font-monospace">{profession.code}</Badge>
						</div>
						{profession.description && (
							<div className="text-muted small mt-1">{profession.description}</div>
						)}
					</div>
				</div>
				<div className="d-flex align-items-center gap-2 ms-3">
					<Badge bg="primary" pill>
						{profession.professionTypesCount} {profession.professionTypesCount === 1 ? 'type' : 'types'}
					</Badge>
					<Button 
						variant="outline-success" 
						size="sm"
						onClick={handleAddType}
						title="Add profession type"
					>
						<i className="mdi mdi-plus"></i>
					</Button>
					<Button 
						variant="outline-primary" 
						size="sm"
						onClick={handleEdit}
						title="Edit profession"
					>
						<i className="mdi mdi-pencil"></i>
					</Button>
					<Button 
						variant="outline-danger" 
						size="sm"
						onClick={handleDelete}
						title="Delete profession"
					>
						<i className="mdi mdi-delete"></i>
					</Button>
				</div>
			</div>
			<Collapse in={isExpanded}>
				<div>
					<div className="border-top">
						{professionTypes.length === 0 ? (
							<div className="text-muted text-center py-3">
								<i className="mdi mdi-information-outline me-1"></i>
								No profession types defined
							</div>
						) : (
							professionTypes.map((pt) => (
								<ProfessionTypeRow
									key={pt.id}
									professionType={pt}
									licenseRequirements={licenseRequirements.get(pt.id) || []}
									isExpanded={expandedTypeIds.has(pt.id)}
									onToggle={() => onToggleType(pt.id)}
									onEdit={() => onEditType(pt)}
									onDelete={() => onDeleteType(pt)}
									onAddRequirement={() => onAddRequirement(pt)}
									onEditRequirement={(req) => onEditRequirement(pt, req)}
									onDeleteRequirement={(req) => onDeleteRequirement(pt, req)}
								/>
							))
						)}
					</div>
				</div>
			</Collapse>
		</div>
	);
});

ProfessionRow.displayName = 'ProfessionRow';

export default ProfessionRow;
