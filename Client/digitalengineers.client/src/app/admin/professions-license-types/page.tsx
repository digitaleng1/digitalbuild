import { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Button, Alert } from 'react-bootstrap';
import ProfessionsTree from './components/ProfessionsTree';
import { useDictionaries } from './hooks/useDictionaries';
import EditProfessionModal from './components/EditProfessionModal';
import AddProfessionTypeModal from './components/AddProfessionTypeModal';
import EditProfessionTypeModal from './components/EditProfessionTypeModal';
import AddLicenseRequirementModal from './components/AddLicenseRequirementModal';
import EditLicenseRequirementModal from './components/EditLicenseRequirementModal';
import EditLicenseTypeModal from './components/EditLicenseTypeModal';
import CreateProfessionModal from '@/app/shared/components/create-project/CreateProfessionModal';
import CreateLicenseTypeModal from '@/app/shared/components/create-project/CreateLicenseTypeModal';
import type { 
	ProfessionManagementDto,
	ProfessionTypeDetailDto,
	LicenseTypeManagementDto,
	LicenseRequirement,
	ProfessionViewModel,
	LicenseTypeViewModel
} from '@/types/lookup';

const ProfessionsLicenseTypesPage = () => {
	const {
		professions,
		professionTypes,
		licenseTypes,
		licenseRequirements,
		loading,
		error,
		refresh,
		updateProfession,
		deleteProfession,
		createProfessionType,
		updateProfessionType,
		deleteProfessionType,
		updateLicenseType,
		deleteLicenseType,
		loadLicenseRequirements,
		createLicenseRequirement,
		updateLicenseRequirement,
		deleteLicenseRequirement,
	} = useDictionaries();

	const [activeTab, setActiveTab] = useState<string>('professions');

	// Create modals
	const [createProfessionModal, setCreateProfessionModal] = useState(false);
	const [createLicenseTypeModal, setCreateLicenseTypeModal] = useState(false);

	// Edit Profession modal
		const [editProfessionModal, setEditProfessionModal] = useState<{
			show: boolean;
			profession: ProfessionManagementDto | null;
		}>({ show: false, profession: null });
		
		// Add/Edit Profession Type modals
		const [addProfessionTypeModal, setAddProfessionTypeModal] = useState<{
			show: boolean;
			profession: ProfessionManagementDto | null;
		}>({ show: false, profession: null });
		
		const [editProfessionTypeModal, setEditProfessionTypeModal] = useState<{
			show: boolean;
			professionType: ProfessionTypeDetailDto | null;
		}>({ show: false, professionType: null });

		// Edit License Type modal
		const [editLicenseTypeModal, setEditLicenseTypeModal] = useState<{
			show: boolean;
			licenseType: LicenseTypeManagementDto | null;
		}>({ show: false, licenseType: null });

		// Add/Edit License Requirement modals
		const [addLicenseRequirementModal, setAddLicenseRequirementModal] = useState<{
			show: boolean;
			professionType: ProfessionTypeDetailDto | null;
		}>({ show: false, professionType: null });

		const [editLicenseRequirementModal, setEditLicenseRequirementModal] = useState<{
			show: boolean;
			professionType: ProfessionTypeDetailDto | null;
			requirement: LicenseRequirement | null;
		}>({ show: false, professionType: null, requirement: null });

		// Handlers for Create
		const handleCreateProfession = useCallback(() => {
			setCreateProfessionModal(true);
		}, []);

		const handleCreateProfessionSuccess = useCallback((newProfession: ProfessionViewModel) => {
			refresh();
			setCreateProfessionModal(false);
		}, [refresh]);

		const handleCreateLicenseType = useCallback(() => {
			setCreateLicenseTypeModal(true);
		}, []);

		const handleCreateLicenseTypeSuccess = useCallback((newLicenseType: LicenseTypeViewModel) => {
			refresh();
			setCreateLicenseTypeModal(false);
		}, [refresh]);

		// Handlers for Profession
		const handleEditProfession = useCallback((profession: ProfessionManagementDto) => {
			setEditProfessionModal({ show: true, profession });
		}, []);

		const handleDeleteProfession = useCallback(async (profession: ProfessionManagementDto) => {
			if (window.confirm(`Are you sure you want to delete profession "${profession.name}"?`)) {
				try {
					await deleteProfession(profession.id);
				} catch (error) {
					console.error('Failed to delete profession:', error);
				}
			}
		}, [deleteProfession]);

		// Handlers for Profession Type
		const handleAddProfessionType = useCallback((profession: ProfessionManagementDto) => {
			setAddProfessionTypeModal({ show: true, profession });
		}, []);

		const handleEditProfessionType = useCallback((professionType: ProfessionTypeDetailDto) => {
			setEditProfessionTypeModal({ show: true, professionType });
		}, []);

		const handleDeleteProfessionType = useCallback(async (professionType: ProfessionTypeDetailDto) => {
			if (window.confirm(`Are you sure you want to delete profession type "${professionType.name}"?`)) {
				try {
					await deleteProfessionType(professionType.id, professionType.professionId);
				} catch (error) {
					console.error('Failed to delete profession type:', error);
				}
			}
		}, [deleteProfessionType]);

		// Handlers for License Type
		const handleEditLicenseType = useCallback((licenseType: LicenseTypeManagementDto) => {
			setEditLicenseTypeModal({ show: true, licenseType });
		}, []);

		const handleDeleteLicenseType = useCallback(async (licenseType: LicenseTypeManagementDto) => {
			if (window.confirm(`Are you sure you want to delete license type "${licenseType.name}"?`)) {
				try {
					await deleteLicenseType(licenseType.id);
				} catch (error) {
					console.error('Failed to delete license type:', error);
				}
			}
		}, [deleteLicenseType]);

		// Handlers for License Requirements
		const handleAddLicenseRequirement = useCallback((professionType: ProfessionTypeDetailDto) => {
			setAddLicenseRequirementModal({ show: true, professionType });
		}, []);

		const handleEditLicenseRequirement = useCallback((professionType: ProfessionTypeDetailDto, requirement: LicenseRequirement) => {
			setEditLicenseRequirementModal({ show: true, professionType, requirement });
		}, []);

		const handleDeleteLicenseRequirement = useCallback(async (professionType: ProfessionTypeDetailDto, requirement: LicenseRequirement) => {
			if (window.confirm(`Are you sure you want to delete license requirement "${requirement.licenseTypeName}"?`)) {
				try {
					await deleteLicenseRequirement(professionType.id, requirement.licenseTypeId);
				} catch (error) {
					console.error('Failed to delete license requirement:', error);
				}
			}
		}, [deleteLicenseRequirement]);

		const licenseTypesForTab = useMemo(() => {
			return licenseTypes.map(lt => ({
				...lt,
				professionName: 'N/A' // Упрощено - не показываем связь с Profession
			}));
		}, [licenseTypes]);

		return (
			<>
				<Container fluid>
					<Row>
						<Col xs={12}>
							<div className="page-title-box">
								<div className="page-title-right">
									<Button 
										variant="primary"
										size="sm"
										onClick={refresh}
										disabled={loading}
									>
										<i className="mdi mdi-refresh me-1"></i>
										Refresh
									</Button>
								</div>
								<h4 className="page-title">Professions & License Types Management</h4>
							</div>
						</Col>
					</Row>

					{error && (
						<Row>
							<Col xs={12}>
								<Alert variant="danger" dismissible onClose={() => {}}>
									<i className="mdi mdi-alert-circle-outline me-2"></i>
									{error}
								</Alert>
							</Col>
						</Row>
					)}

					<Row>
						<Col xs={12}>
							<Card>
								<Card.Body>
									<Tab.Container 
										activeKey={activeTab} 
										onSelect={(k) => k && setActiveTab(k)}
									>
										<Nav variant="tabs" className="mb-3">
											<Nav.Item>
												<Nav.Link eventKey="professions">
													Professions & Types
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey="licenses">
													License Types
												</Nav.Link>
											</Nav.Item>
										</Nav>

										<Tab.Content>
											{/* Professions Tab */}
											<Tab.Pane eventKey="professions">
												<div className="d-flex justify-content-between align-items-center mb-3">
													<h5 className="mb-0">Professions Hierarchy</h5>
													<Button
														variant="success"
														size="sm"
														onClick={handleCreateProfession}
													>
														<i className="mdi mdi-plus me-1"></i>
														Add Profession
													</Button>
												</div>
												
												{loading ? (
													<div className="text-center py-5">
														<div className="spinner-border text-primary" role="status">
															<span className="visually-hidden">Loading...</span>
														</div>
													</div>
												) : professions.length === 0 ? (
													<Alert variant="info">
														<i className="mdi mdi-information-outline me-2"></i>
														No professions found. Create your first profession to get started.
													</Alert>
												) : (
													<ProfessionsTree
														professions={professions}
														professionTypes={professionTypes}
														licenseRequirements={licenseRequirements}
														onLoadLicenseRequirements={loadLicenseRequirements}
														onEditProfession={handleEditProfession}
														onDeleteProfession={handleDeleteProfession}
														onAddProfessionType={handleAddProfessionType}
														onEditProfessionType={handleEditProfessionType}
														onDeleteProfessionType={handleDeleteProfessionType}
														onAddLicenseRequirement={handleAddLicenseRequirement}
														onEditLicenseRequirement={handleEditLicenseRequirement}
														onDeleteLicenseRequirement={handleDeleteLicenseRequirement}
													/>
												)}
											</Tab.Pane>

											{/* License Types Tab */}
											<Tab.Pane eventKey="licenses">
												<div className="d-flex justify-content-between align-items-center mb-3">
													<h5 className="mb-0">All License Types</h5>
													<Button
														variant="success"
														size="sm"
														onClick={handleCreateLicenseType}
													>
														<i className="mdi mdi-plus me-1"></i>
														Add License Type
													</Button>
												</div>
												
												{loading ? (
													<div className="text-center py-5">
														<div className="spinner-border text-primary" role="status">
															<span className="visually-hidden">Loading...</span>
														</div>
													</div>
												) : licenseTypes.length === 0 ? (
													<Alert variant="info">
														<i className="mdi mdi-information-outline me-2"></i>
														No license types found.
													</Alert>
												) : (
													<div className="table-responsive">
														<table className="table table-hover table-centered mb-0">
															<thead className="table-light">
																<tr>
																	<th>License Type</th>
																	<th>Code</th>
																	<th>State Specific</th>
																	<th>Description</th>
																	<th className="text-end">Actions</th>
																</tr>
															</thead>
															<tbody>
																{licenseTypesForTab.map((licenseType) => (
																	<tr key={licenseType.id}>
																		<td>
																			<span className="fw-medium">{licenseType.name}</span>
																		</td>
																		<td>
																			<code>{licenseType.code}</code>
																		</td>
																		<td>
																			{licenseType.isStateSpecific ? (
																				<span className="badge bg-info">Yes</span>
																			) : (
																				<span className="badge bg-secondary">No</span>
																			)}
																		</td>
																		<td>
																			<div className="text-muted" style={{ maxWidth: '400px' }}>
																				{licenseType.description}
																			</div>
																		</td>
																		<td className="text-end">
																			<Button
																				variant="outline-primary"
																				size="sm"
																				className="me-1"
																				onClick={() => handleEditLicenseType(licenseType)}
																			>
																				<i className="mdi mdi-pencil"></i>
																			</Button>
																			<Button
																				variant="outline-danger"
																				size="sm"
																				onClick={() => handleDeleteLicenseType(licenseType)}
																			>
																				<i className="mdi mdi-delete"></i>
																			</Button>
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													</div>
												)}
											</Tab.Pane>
										</Tab.Content>
									</Tab.Container>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>

				{/* Create Modals */}
				<CreateProfessionModal
					show={createProfessionModal}
					onHide={() => setCreateProfessionModal(false)}
					onSuccess={handleCreateProfessionSuccess}
				/>

				<CreateLicenseTypeModal
					show={createLicenseTypeModal}
					onHide={() => setCreateLicenseTypeModal(false)}
					onSuccess={handleCreateLicenseTypeSuccess}
				/>

				{/* Edit Modals */}
				{editProfessionModal.profession && (
					<EditProfessionModal
						show={editProfessionModal.show}
						onHide={() => setEditProfessionModal({ show: false, profession: null })}
						profession={editProfessionModal.profession}
						onSuccess={refresh}
						onUpdate={updateProfession}
					/>
				)}

				{addProfessionTypeModal.profession && (
					<AddProfessionTypeModal
						show={addProfessionTypeModal.show}
						onHide={() => setAddProfessionTypeModal({ show: false, profession: null })}
						profession={addProfessionTypeModal.profession}
						onSuccess={refresh}
						onCreate={createProfessionType}
					/>
				)}

				{editProfessionTypeModal.professionType && (
					<EditProfessionTypeModal
						show={editProfessionTypeModal.show}
						onHide={() => setEditProfessionTypeModal({ show: false, professionType: null })}
						professionType={editProfessionTypeModal.professionType}
						onSuccess={refresh}
						onUpdate={updateProfessionType}
					/>
				)}

				{editLicenseTypeModal.licenseType && (
					<EditLicenseTypeModal
						show={editLicenseTypeModal.show}
						onHide={() => setEditLicenseTypeModal({ show: false, licenseType: null })}
						licenseType={editLicenseTypeModal.licenseType}
						onSuccess={refresh}
						onUpdate={updateLicenseType}
					/>
				)}

				{addLicenseRequirementModal.professionType && (
					<AddLicenseRequirementModal
						show={addLicenseRequirementModal.show}
						onHide={() => setAddLicenseRequirementModal({ show: false, professionType: null })}
						professionType={addLicenseRequirementModal.professionType}
						availableLicenseTypes={licenseTypes}
						existingRequirements={licenseRequirements.get(addLicenseRequirementModal.professionType.id) || []}
						onSuccess={refresh}
						onCreate={(professionTypeId, dto) => createLicenseRequirement(professionTypeId, dto)}
					/>
				)}

				{editLicenseRequirementModal.requirement && editLicenseRequirementModal.professionType && (
					<EditLicenseRequirementModal
						show={editLicenseRequirementModal.show}
						onHide={() => setEditLicenseRequirementModal({ show: false, professionType: null, requirement: null })}
						requirement={editLicenseRequirementModal.requirement}
						professionType={editLicenseRequirementModal.professionType}
						onSuccess={refresh}
						onUpdate={(id, professionTypeId, dto) => updateLicenseRequirement(id, professionTypeId, dto)}
					/>
				)}
			</>
		);
	};

export default ProfessionsLicenseTypesPage;
