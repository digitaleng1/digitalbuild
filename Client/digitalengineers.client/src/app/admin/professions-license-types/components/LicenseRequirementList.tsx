import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import type { LicenseRequirement } from '@/types/lookup';

interface LicenseRequirementListProps {
	requirements: LicenseRequirement[];
	onEdit: (requirement: LicenseRequirement) => void;
	onDelete: (requirement: LicenseRequirement) => void;
}

const LicenseRequirementList: React.FC<LicenseRequirementListProps> = React.memo(({ 
	requirements, 
	onEdit, 
	onDelete 
}) => {
	if (requirements.length === 0) {
		return (
			<div className="text-muted small ps-4 py-2">
				<i className="mdi mdi-information-outline me-1"></i>
				No license requirements configured
			</div>
		);
	}

	return (
		<div className="ps-4 py-2">
			<div className="text-uppercase text-muted small fw-bold mb-2">
				License Requirements
			</div>
			{requirements.map((req) => (
				<div 
					key={req.id} 
					className="d-flex align-items-start justify-content-between py-2 border-bottom"
				>
					<div className="d-flex align-items-start">
						<i className="mdi mdi-certificate-outline text-primary me-2 mt-1"></i>
						<div>
							<div className="d-flex align-items-center flex-wrap gap-1">
								<strong>{req.licenseTypeCode}</strong>
								<span className="text-muted">—</span>
								<span>{req.licenseTypeName}</span>
								{req.isRequired ? (
									<Badge bg="danger" className="ms-1">Required</Badge>
								) : (
									<Badge bg="secondary" className="ms-1">Optional</Badge>
								)}
								{req.isStateSpecific && (
									<Badge bg="warning" text="dark" className="ms-1">
										<i className="mdi mdi-map-marker-outline me-1"></i>
										State-Specific
									</Badge>
								)}
							</div>
							{req.notes && (
								<div className="text-muted small mt-1">{req.notes}</div>
							)}
						</div>
					</div>
					<div className="d-flex gap-1 ms-2">
						<Button 
							variant="link" 
							size="sm" 
							className="text-primary p-0"
							onClick={() => onEdit(req)}
							title="Edit requirement"
						>
							<i className="mdi mdi-pencil"></i>
						</Button>
						<Button 
							variant="link" 
							size="sm" 
							className="text-danger p-0"
							onClick={() => onDelete(req)}
							title="Delete requirement"
						>
							<i className="mdi mdi-delete"></i>
						</Button>
					</div>
				</div>
			))}
		</div>
	);
});

LicenseRequirementList.displayName = 'LicenseRequirementList';

export default LicenseRequirementList;
