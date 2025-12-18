import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Row, Col, Card, Tabs, Tab, Spinner, Alert, Button, Modal, Badge } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useDictionaries } from './hooks/useDictionaries';
import ProfessionsTree from './components/ProfessionsTree';
import EditProfessionModal from './components/EditProfessionModal';
import EditLicenseTypeModal from './components/EditLicenseTypeModal';
import ApproveProfessionModal from './components/ApproveProfessionModal';
import ApproveLicenseTypeModal from './components/ApproveLicenseTypeModal';
import AddProfessionTypeModal from './components/AddProfessionTypeModal';
import EditProfessionTypeModal from './components/EditProfessionTypeModal';
import ApproveProfessionTypeModal from './components/ApproveProfessionTypeModal';
import AddLicenseRequirementModal from './components/AddLicenseRequirementModal';
import EditLicenseRequirementModal from './components/EditLicenseRequirementModal';
import lookupService from '@/services/lookupService';
import { useToast } from '@/contexts/ToastContext';
import type { 
	ProfessionManagementDto, 
	LicenseTypeManagementDto, 
	ProfessionTypeManagementDto,
	LicenseRequirement,
	ImportDictionaries 
} from '@/types/lookup';

const DictionariesManagementPage: React.FC = () => {
	const {
		professions,
		professionTypes,
		licenseTypes,
		licenseRequirements,
		loading,
		error,
		refresh,
		updateProfession,
		approveProfession,
		deleteProfession,
		createProfessionType,
		updateProfessionType,
		approveProfessionType,
		deleteProfessionType,
		updateLicenseType,
		approveLicenseType,
		deleteLicenseType,
		loadLicenseRequirements,
		createLicenseRequirement,
		updateLicenseRequirement,
		deleteLicenseRequirement,
	} = useDictionaries();

	const { showSuccess, showError } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [activeTab, setActiveTab] = useState<string>('professions');
	
	// Profession modals
	const [editProfessionModal, setEditProfessionModal] = useState<ProfessionManagementDto | null>(null);
	const [approveProfessionModal, setApproveProfessionModal] = useState<ProfessionManagementDto | null>(null);
	
	// ProfessionType modals
	const [addProfessionTypeModal, setAddProfessionTypeModal] = useState<ProfessionManagementDto | null>(null);
	const [editProfessionTypeModal, setEditProfessionTypeModal] = useState<ProfessionTypeManagementDto | null>(null);
	const [approveProfessionTypeModal, setApproveProfessionTypeModal] = useState<ProfessionTypeManagementDto | null>(null);
	
	// LicenseType modals
	const [editLicenseTypeModal, setEditLicenseTypeModal] = useState<LicenseTypeManagementDto | null>(null);
	const [approveLicenseTypeModal, setApproveLicenseTypeModal] = useState<LicenseTypeManagementDto | null>(null);
	
	// LicenseRequirement modals
	const [addRequirementModal, setAddRequirementModal] = useState<ProfessionTypeManagementDto | null>(null);
	const [editRequirementModal, setEditRequirementModal] = useState<{
		professionType: ProfessionTypeManagementDto;
		requirement: LicenseRequirement;
	} | null>(null);
	
	// Delete confirmation modal
	const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
		type: 'profession' | 'professionType' | 'licenseType' | 'licenseRequirement';
		item: ProfessionManagementDto | ProfessionTypeManagementDto | LicenseTypeManagementDto | LicenseRequirement;
		parentId?: number;
	} | null>(null);
	
	const [deleting, setDeleting] = useState(false);
	const [exporting, setExporting] = useState(false);

	// ==================== HANDLERS ====================

	const handleApproveProfession = useCallback(async (id: number, isApproved: boolean, rejectionReason?: string) => {
		await approveProfession(id, { isApproved, rejectionReason });
	}, [approveProfession]);

	const handleApproveProfessionType = useCallback(async (id: number, isApproved: boolean, rejectionReason?: string) => {
		await approveProfessionType(id, { isApproved, rejectionReason });
	}, [approveProfessionType]);

	const handleApproveLicenseType = useCallback(async (id: number, isApproved: boolean, rejectionReason?: string) => {
		await approveLicenseType(id, { isApproved, rejectionReason });
	}, [approveLicenseType]);

	const handleDeleteConfirm = useCallback(async () => {
		if (!deleteConfirmModal) return;
		
		setDeleting(true);
		try {
			switch (deleteConfirmModal.type) {
				case 'profession':
					await deleteProfession(deleteConfirmModal.item.id);
					break;
				case 'professionType':
					await deleteProfessionType(
						deleteConfirmModal.item.id, 
						(deleteConfirmModal.item as ProfessionTypeManagementDto).professionId
					);
					break;
				case 'licenseType':
					await deleteLicenseType(deleteConfirmModal.item.id);
					break;
				case 'licenseRequirement':
					if (deleteConfirmModal.parentId) {
						await deleteLicenseRequirement(deleteConfirmModal.item.id, deleteConfirmModal.parentId);
					}
					break;
			}
			setDeleteConfirmModal(null);
		} catch (err) {
			// Error handled in hook
		} finally {
			setDeleting(false);
		}
	}, [deleteConfirmModal, deleteProfession, deleteProfessionType, deleteLicenseType, deleteLicenseRequirement]);

	const handleExport = useCallback(async () => {
		setExporting(true);
		try {
			const data = await lookupService.exportDictionaries();
			
			const json = JSON.stringify(data, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			
			const link = document.createElement('a');
			link.href = url;
			link.download = `dictionaries_export_${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			
			showSuccess('Success', 'Dictionaries exported successfully');
		} catch (error) {
			showError('Error', 'Failed to export dictionaries');
		} finally {
			setExporting(false);
		}
	}, [showSuccess, showError]);

	const handleImportClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const data: ImportDictionaries = JSON.parse(text);
			
			const result = await lookupService.importDictionaries(data);
			
			if (result.success) {
				const message = [
					`Professions: ${result.professionsCreated} created, ${result.professionsUpdated} updated`,
					`Types: ${result.professionTypesCreated} created, ${result.professionTypesUpdated} updated`,
					`Licenses: ${result.licenseTypesCreated} created, ${result.licenseTypesUpdated} updated`,
					`Requirements: ${result.licenseRequirementsCreated} created, ${result.licenseRequirementsUpdated} updated`,
				].join('\n');
				showSuccess('Import Complete', message);
				await refresh();
			} else {
				const errorMessage = result.errors.join('\n');
				showError('Import Failed', errorMessage);
			}
		} catch (error) {
			showError('Error', 'Failed to parse or import JSON file');
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	}, [showSuccess, showError, refresh]);

	// ==================== TREE HANDLERS ====================

	const handleEditRequirement = useCallback((
		professionType: ProfessionTypeManagementDto, 
		requirement: LicenseRequirement
	) => {
		setEditRequirementModal({ professionType, requirement });
	}, []);

	const handleDeleteRequirement = useCallback((
		professionType: ProfessionTypeManagementDto, 
		requirement: LicenseRequirement
	) => {
		setDeleteConfirmModal({
			type: 'licenseRequirement',
			item: requirement,
			parentId: professionType.id,
		});
	}, []);

	// ==================== COMPUTED VALUES ====================

	const pendingProfessions = useMemo(() => 
		professions.filter(p => !p.isApproved).length, 
		[professions]
	);

	const pendingProfessionTypes = useMemo(() => 
		professionTypes.filter(pt => !pt.isApproved).length, 
		[professionTypes]
	);

	const pendingLicenseTypes = useMemo(() => 
		licenseTypes.filter(lt => !lt.isApproved).length, 
		[licenseTypes]
	);

	const totalPending = pendingProfessions + pendingProfessionTypes + pendingLicenseTypes;

	// ==================== RENDER ====================

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="Dictionaries Management" subName="Admin" />
				<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
					<Spinner animation="border" variant="primary" />
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<PageBreadcrumb title="Dictionaries Management" subName="Admin" />
				<Alert variant="danger">
					<i className="mdi mdi-alert-circle-outline me-2"></i>
					{error}
				</Alert>
			</>
		);
	}

	return (
		<>
			<PageBreadcrumb title="Dictionaries Management" subName="Admin" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<div className="d-flex justify-content-between align-items-center mb-3">
								<div>
									<h4 className="mb-0">Professions & License Types</h4>
									<p className="text-muted mb-0">
										Manage profession categories, types, and license requirements
										{totalPending > 0 && (
											<Badge bg="warning" text="dark" className="ms-2">
												{totalPending} pending approval
											</Badge>
										)}
									</p>
								</div>
								<div className="d-flex gap-2">
									<Button variant="outline-primary" onClick={handleExport} disabled={exporting}>
										{exporting ? (
											<>
												<Spinner as="span" animation="border" size="sm" className="me-2" />
												Exporting...
											</>
										) : (
											<>
												<i className="mdi mdi-download me-1"></i>
												Export
											</>
										)}
									</Button>
									
									<Button variant="outline-success" onClick={handleImportClick}>
										<i className="mdi mdi-upload me-1"></i>
										Import
									</Button>
									
									<input
										ref={fileInputRef}
										type="file"
										accept=".json"
										style={{ display: 'none' }}
										onChange={handleFileChange}
									/>

									<Button variant="primary" onClick={refresh}>
										<i className="mdi mdi-refresh me-1"></i>
										Refresh
									</Button>
								</div>
							</div>

							<Tabs
								activeKey={activeTab}
								onSelect={(k) => setActiveTab(k || 'professions')}
								className="mb-3"
							>
								<Tab 
									eventKey="professions" 
									title={
										<span>
											Professions 
											{(pendingProfessions + pendingProfessionTypes) > 0 && (
												<Badge bg="warning" text="dark" className="ms-2">
													{pendingProfessions + pendingProfessionTypes}
												</Badge>
											)}
										</span>
									}
								>
									<ProfessionsTree
										professions={professions}
										professionTypes={professionTypes}
										licenseRequirements={licenseRequirements}
										onLoadLicenseRequirements={loadLicenseRequirements}
										onEditProfession={setEditProfessionModal}
										onApproveProfession={setApproveProfessionModal}
										onDeleteProfession={(p) => setDeleteConfirmModal({ type: 'profession', item: p })}
										onAddProfessionType={setAddProfessionTypeModal}
										onEditProfessionType={setEditProfessionTypeModal}
										onApproveProfessionType={setApproveProfessionTypeModal}
										onDeleteProfessionType={(pt) => setDeleteConfirmModal({ type: 'professionType', item: pt })}
										onAddLicenseRequirement={setAddRequirementModal}
										onEditLicenseRequirement={handleEditRequirement}
										onDeleteLicenseRequirement={handleDeleteRequirement}
									/>
								</Tab>

								<Tab 
									eventKey="licenseTypes" 
									title={
										<span>
											License Types 
											{pendingLicenseTypes > 0 && (
												<Badge bg="warning" text="dark" className="ms-2">
													{pendingLicenseTypes}
												</Badge>
											)}
										</span>
									}
								>
									{licenseTypes.length === 0 ? (
										<Alert variant="info">
											<i className="mdi mdi-information-outline me-2"></i>
											No license types found
										</Alert>
									) : (
										<div className="list-group">
											{licenseTypes.map((lt) => (
												<div 
													key={lt.id} 
													className="list-group-item"
												>
													<div className="d-flex justify-content-between align-items-start">
														<div className="flex-grow-1">
															<div className="d-flex align-items-center mb-2 flex-wrap gap-2">
																<h6 className="mb-0">{lt.name}</h6>
																<Badge bg="info" className="font-monospace">{lt.code}</Badge>
																{!lt.isApproved && (
																	<Badge bg="warning" text="dark">Pending</Badge>
																)}
																{lt.isStateSpecific && (
																	<Badge bg="secondary">
																		<i className="mdi mdi-map-marker-outline me-1"></i>
																		State-Specific
																	</Badge>
																)}
															</div>
															<p className="text-muted mb-1">{lt.description}</p>
															{lt.usageCount > 0 && (
																<small className="text-muted">
																	Used in {lt.usageCount} profession type{lt.usageCount > 1 ? 's' : ''}
																</small>
															)}
															{lt.createdByUserName && (
																<div>
																	<small className="text-muted">
																		Created by: <strong>{lt.createdByUserName}</strong> on{' '}
																		{new Date(lt.createdAt).toLocaleDateString()}
																	</small>
																</div>
															)}
															{lt.rejectionReason && (
																<div className="alert alert-danger mt-2 mb-0 py-1 px-2">
																	<small><strong>Rejected:</strong> {lt.rejectionReason}</small>
																</div>
															)}
														</div>
														<div className="d-flex gap-2">
															<Button 
																variant="outline-primary" 
																size="sm"
																onClick={() => setEditLicenseTypeModal(lt)}
															>
																<i className="mdi mdi-pencil me-1"></i>
																Edit
															</Button>
															{!lt.isApproved && (
																<Button 
																	variant="outline-success" 
																	size="sm"
																	onClick={() => setApproveLicenseTypeModal(lt)}
																>
																	<i className="mdi mdi-check-circle me-1"></i>
																	Review
																</Button>
															)}
															<Button 
																variant="outline-danger" 
																size="sm"
																onClick={() => setDeleteConfirmModal({ type: 'licenseType', item: lt })}
															>
																<i className="mdi mdi-delete me-1"></i>
																Delete
															</Button>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</Tab>
							</Tabs>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Profession Modals */}
			<EditProfessionModal
				show={!!editProfessionModal}
				onHide={() => setEditProfessionModal(null)}
				profession={editProfessionModal}
				onUpdate={updateProfession}
			/>

			<ApproveProfessionModal
				show={!!approveProfessionModal}
				onHide={() => setApproveProfessionModal(null)}
				profession={approveProfessionModal}
				onApprove={handleApproveProfession}
			/>

			{/* Profession Type Modals */}
			<AddProfessionTypeModal
				show={!!addProfessionTypeModal}
				onHide={() => setAddProfessionTypeModal(null)}
				profession={addProfessionTypeModal}
				onCreate={createProfessionType}
			/>

			<EditProfessionTypeModal
				show={!!editProfessionTypeModal}
				onHide={() => setEditProfessionTypeModal(null)}
				professionType={editProfessionTypeModal}
				onUpdate={updateProfessionType}
			/>

			<ApproveProfessionTypeModal
				show={!!approveProfessionTypeModal}
				onHide={() => setApproveProfessionTypeModal(null)}
				professionType={approveProfessionTypeModal}
				onApprove={handleApproveProfessionType}
			/>

			{/* License Type Modals */}
			<EditLicenseTypeModal
				show={!!editLicenseTypeModal}
				onHide={() => setEditLicenseTypeModal(null)}
				licenseType={editLicenseTypeModal}
				onUpdate={updateLicenseType}
			/>

			<ApproveLicenseTypeModal
				show={!!approveLicenseTypeModal}
				onHide={() => setApproveLicenseTypeModal(null)}
				licenseType={approveLicenseTypeModal}
				onApprove={handleApproveLicenseType}
			/>

			{/* License Requirement Modals */}
			<AddLicenseRequirementModal
				show={!!addRequirementModal}
				onHide={() => setAddRequirementModal(null)}
				professionType={addRequirementModal}
				licenseTypes={licenseTypes}
				existingRequirements={addRequirementModal ? licenseRequirements.get(addRequirementModal.id) || [] : []}
				onCreate={createLicenseRequirement}
			/>

			<EditLicenseRequirementModal
				show={!!editRequirementModal}
				onHide={() => setEditRequirementModal(null)}
				professionType={editRequirementModal?.professionType || null}
				requirement={editRequirementModal?.requirement || null}
				onUpdate={updateLicenseRequirement}
			/>

			{/* Delete Confirmation Modal */}
			<Modal 
				show={!!deleteConfirmModal} 
				onHide={() => !deleting && setDeleteConfirmModal(null)}
				centered
			>
				<Modal.Header closeButton={!deleting}>
					<Modal.Title>Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{deleteConfirmModal && (
						<>
							<p>
								Are you sure you want to delete this {
									deleteConfirmModal.type === 'profession' ? 'profession' :
									deleteConfirmModal.type === 'professionType' ? 'profession type' :
									deleteConfirmModal.type === 'licenseType' ? 'license type' :
									'license requirement'
								}?
							</p>
							<div className="alert alert-warning">
								<i className="mdi mdi-alert me-2"></i>
								<strong>
									{deleteConfirmModal.type === 'licenseRequirement' 
										? `${(deleteConfirmModal.item as LicenseRequirement).licenseTypeCode} — ${(deleteConfirmModal.item as LicenseRequirement).licenseTypeName}`
										: (deleteConfirmModal.item as ProfessionManagementDto).name
									}
								</strong>
							</div>
							{deleteConfirmModal.type === 'profession' && (
								<p className="text-danger">
									<strong>Warning:</strong> All associated profession types and their license requirements will also be deleted.
								</p>
							)}
							{deleteConfirmModal.type === 'professionType' && (
								<p className="text-danger">
									<strong>Warning:</strong> All associated license requirements will also be deleted.
								</p>
							)}
							{deleteConfirmModal.type === 'licenseType' && (deleteConfirmModal.item as LicenseTypeManagementDto).usageCount > 0 && (
								<p className="text-danger">
									<strong>Warning:</strong> This license type is used in {(deleteConfirmModal.item as LicenseTypeManagementDto).usageCount} profession type(s). Those requirements will be removed.
								</p>
							)}
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setDeleteConfirmModal(null)} disabled={deleting}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
						{deleting ? (
							<>
								<Spinner as="span" animation="border" size="sm" className="me-2" />
								Deleting...
							</>
						) : (
							<>
								<i className="mdi mdi-delete me-1"></i>
								Delete
							</>
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default DictionariesManagementPage;
