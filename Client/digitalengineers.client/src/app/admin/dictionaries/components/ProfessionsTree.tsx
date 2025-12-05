import React from 'react';
import { Accordion, Badge, Button } from 'react-bootstrap';
import type { ProfessionManagementDto, LicenseTypeManagementDto } from '@/types/lookup';

interface ProfessionsTreeProps {
	professions: ProfessionManagementDto[];
	licenseTypes: LicenseTypeManagementDto[];
	onEdit: (profession: ProfessionManagementDto) => void;
	onApprove: (profession: ProfessionManagementDto) => void;
	onDelete: (profession: ProfessionManagementDto) => void;
	onEditLicenseType: (licenseType: LicenseTypeManagementDto) => void;
	onApproveLicenseType: (licenseType: LicenseTypeManagementDto) => void;
	onDeleteLicenseType: (licenseType: LicenseTypeManagementDto) => void;
}

const ProfessionsTree: React.FC<ProfessionsTreeProps> = ({ 
	professions, 
	licenseTypes, 
	onEdit, 
	onApprove, 
	onDelete,
	onEditLicenseType,
	onApproveLicenseType,
	onDeleteLicenseType
}) => {
	const getLicenseTypesForProfession = (professionId: number) => {
		return licenseTypes.filter(lt => lt.professionId === professionId);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<Accordion defaultActiveKey="0">
			{professions.map((profession, index) => {
				const relatedLicenseTypes = getLicenseTypesForProfession(profession.id);
				const pendingCount = relatedLicenseTypes.filter(lt => !lt.isApproved).length;

				return (
					<Accordion.Item eventKey={index.toString()} key={profession.id}>
						<Accordion.Header>
							<div className="d-flex align-items-center justify-content-between w-100 me-3">
								<div className="d-flex align-items-center">
									<strong className="me-2">{profession.name}</strong>
									{!profession.isApproved && (
										<Badge bg="warning" text="dark">Pending</Badge>
									)}
									{profession.isApproved && profession.rejectionReason && (
										<Badge bg="danger">Rejected</Badge>
									)}
								</div>
								<div className="d-flex align-items-center gap-2">
									<Badge bg="secondary">{relatedLicenseTypes.length} types</Badge>
									{pendingCount > 0 && (
										<Badge bg="warning" text="dark">{pendingCount} pending</Badge>
									)}
								</div>
							</div>
						</Accordion.Header>
						<Accordion.Body>
							<div className="mb-3">
								<p className="text-muted mb-2">{profession.description}</p>
								{profession.createdByName && (
									<small className="text-muted">
										Created by: <strong>{profession.createdByName}</strong> on {formatDate(profession.createdAt)}
									</small>
								)}
								{profession.rejectionReason && (
									<div className="alert alert-danger mt-2 mb-2">
										<strong>Rejection Reason:</strong> {profession.rejectionReason}
									</div>
								)}
							</div>

							<div className="d-flex gap-2 mb-3">
								<Button 
									variant="primary" 
									size="sm" 
									onClick={() => onEdit(profession)}
								>
									<i className="mdi mdi-pencil me-1"></i>
									Edit
								</Button>
								{!profession.isApproved && (
									<Button 
										variant="success" 
										size="sm" 
										onClick={() => onApprove(profession)}
									>
										<i className="mdi mdi-check-circle me-1"></i>
										Review
									</Button>
								)}
								<Button 
									variant="danger" 
									size="sm" 
									onClick={() => onDelete(profession)}
								>
									<i className="mdi mdi-delete me-1"></i>
									Delete
								</Button>
							</div>

							{relatedLicenseTypes.length > 0 && (
								<div className="border-top pt-3">
									<h6 className="mb-3">License Types</h6>
									<div className="list-group">
										{relatedLicenseTypes.map((lt) => (
											<div 
												key={lt.id} 
												className="list-group-item d-flex justify-content-between align-items-start"
											>
												<div className="flex-grow-1">
													<div className="d-flex align-items-center mb-1">
														<strong className="me-2">{lt.name}</strong>
														{!lt.isApproved && (
															<Badge bg="warning" text="dark">Pending</Badge>
														)}
														{lt.isApproved && lt.rejectionReason && (
															<Badge bg="danger">Rejected</Badge>
														)}
													</div>
													<p className="mb-1 text-muted small">{lt.description}</p>
													{lt.createdByName && (
														<small className="text-muted">
															Created by: <strong>{lt.createdByName}</strong>
														</small>
													)}
													{lt.rejectionReason && (
														<div className="alert alert-danger mt-2 mb-0 py-1 px-2">
															<small><strong>Rejected:</strong> {lt.rejectionReason}</small>
														</div>
													)}
												</div>
												<div className="d-flex gap-1 ms-3">
													<Button 
														variant="outline-primary" 
														size="sm"
														onClick={() => onEditLicenseType(lt)}
													>
														<i className="mdi mdi-pencil"></i>
													</Button>
													{!lt.isApproved && (
														<Button 
															variant="outline-success" 
															size="sm"
															onClick={() => onApproveLicenseType(lt)}
														>
															<i className="mdi mdi-check"></i>
														</Button>
													)}
													<Button 
														variant="outline-danger" 
														size="sm"
														onClick={() => onDeleteLicenseType(lt)}
													>
														<i className="mdi mdi-delete"></i>
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</Accordion.Body>
					</Accordion.Item>
				);
			})}
		</Accordion>
	);
};

export default ProfessionsTree;
