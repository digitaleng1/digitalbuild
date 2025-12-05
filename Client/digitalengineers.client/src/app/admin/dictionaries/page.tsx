import React, { useState, useCallback, useMemo } from 'react';
import { Row, Col, Card, Tabs, Tab, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useDictionaries } from './hooks/useDictionaries';
import ProfessionsTree from './components/ProfessionsTree';
import EditProfessionModal from './components/EditProfessionModal';
import EditLicenseTypeModal from './components/EditLicenseTypeModal';
import ApproveProfessionModal from './components/ApproveProfessionModal';
import ApproveLicenseTypeModal from './components/ApproveLicenseTypeModal';
import type { ProfessionManagementDto, LicenseTypeManagementDto } from '@/types/lookup';

const DictionariesManagementPage: React.FC = () => {
	const {
		professions,
		licenseTypes,
		loading,
		error,
		refresh,
		updateProfession,
		updateLicenseType,
		approveProfession,
		approveLicenseType,
		deleteProfession,
		deleteLicenseType,
	} = useDictionaries();

	const [activeTab, setActiveTab] = useState<string>('professions');
	const [editProfessionModal, setEditProfessionModal] = useState<ProfessionManagementDto | null>(null);
	const [editLicenseTypeModal, setEditLicenseTypeModal] = useState<LicenseTypeManagementDto | null>(null);
	const [approveProfessionModal, setApproveProfessionModal] = useState<ProfessionManagementDto | null>(null);
	const [approveLicenseTypeModal, setApproveLicenseTypeModal] = useState<LicenseTypeManagementDto | null>(null);
	const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
		type: 'profession' | 'licenseType';
		item: ProfessionManagementDto | LicenseTypeManagementDto;
	} | null>(null);
	const [deleting, setDeleting] = useState(false);

	const handleApproveProfession = useCallback(async (id: number, isApproved: boolean, rejectionReason?: string) => {
		await approveProfession(id, { isApproved, rejectionReason });
	}, [approveProfession]);

	const handleApproveLicenseType = useCallback(async (id: number, isApproved: boolean, rejectionReason?: string) => {
		await approveLicenseType(id, { isApproved, rejectionReason });
	}, [approveLicenseType]);

	const handleDeleteConfirm = useCallback(async () => {
		if (!deleteConfirmModal) return;
		
		setDeleting(true);
		try {
			if (deleteConfirmModal.type === 'profession') {
				await deleteProfession(deleteConfirmModal.item.id);
			} else {
				await deleteLicenseType(deleteConfirmModal.item.id);
			}
			setDeleteConfirmModal(null);
		} catch (err) {
			// Error handled by hook
		} finally {
			setDeleting(false);
		}
	}, [deleteConfirmModal, deleteProfession, deleteLicenseType]);

	const pendingProfessions = useMemo(() => 
		professions.filter(p => !p.isApproved).length, 
		[professions]
	);

	const pendingLicenseTypes = useMemo(() => 
		licenseTypes.filter(lt => !lt.isApproved).length, 
		[licenseTypes]
	);

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
									<p className="text-muted mb-0">Manage and approve user-submitted entries</p>
								</div>
								<Button variant="primary" onClick={refresh}>
									<i className="mdi mdi-refresh me-1"></i>
									Refresh
								</Button>
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
											{pendingProfessions > 0 && (
												<span className="badge bg-warning text-dark ms-2">{pendingProfessions}</span>
											)}
										</span>
									}
								>
									{professions.length === 0 ? (
										<Alert variant="info">
											<i className="mdi mdi-information-outline me-2"></i>
											No professions found
										</Alert>
									) : (
										<ProfessionsTree
											professions={professions}
											licenseTypes={licenseTypes}
											onEdit={setEditProfessionModal}
											onApprove={setApproveProfessionModal}
											onDelete={(profession) => setDeleteConfirmModal({ type: 'profession', item: profession })}
											onEditLicenseType={setEditLicenseTypeModal}
											onApproveLicenseType={setApproveLicenseTypeModal}
											onDeleteLicenseType={(licenseType) => setDeleteConfirmModal({ type: 'licenseType', item: licenseType })}
										/>
									)}
								</Tab>

								<Tab 
									eventKey="licenseTypes" 
									title={
										<span>
											License Types 
											{pendingLicenseTypes > 0 && (
												<span className="badge bg-warning text-dark ms-2">{pendingLicenseTypes}</span>
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
															<div className="d-flex align-items-center mb-2">
																<h6 className="mb-0 me-2">{lt.name}</h6>
																{!lt.isApproved && (
																	<span className="badge bg-warning text-dark">Pending</span>
																)}
															</div>
															<p className="text-muted mb-1">
																<strong>Profession:</strong> {lt.professionName}
															</p>
															<p className="text-muted mb-1">{lt.description}</p>
															{lt.createdByName && (
																<small className="text-muted">
																	Created by: <strong>{lt.createdByName}</strong> on{' '}
																	{new Date(lt.createdAt).toLocaleDateString()}
																</small>
															)}
															{lt.rejectionReason && (
																<div className="alert alert-danger mt-2 mb-0">
																	<strong>Rejection Reason:</strong> {lt.rejectionReason}
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

			<EditProfessionModal
				show={!!editProfessionModal}
				onHide={() => setEditProfessionModal(null)}
				profession={editProfessionModal}
				onUpdate={updateProfession}
			/>

			<EditLicenseTypeModal
				show={!!editLicenseTypeModal}
				onHide={() => setEditLicenseTypeModal(null)}
				licenseType={editLicenseTypeModal}
				professions={professions}
				onUpdate={updateLicenseType}
			/>

			<ApproveProfessionModal
				show={!!approveProfessionModal}
				onHide={() => setApproveProfessionModal(null)}
				profession={approveProfessionModal}
				onApprove={handleApproveProfession}
			/>

			<ApproveLicenseTypeModal
				show={!!approveLicenseTypeModal}
				onHide={() => setApproveLicenseTypeModal(null)}
				licenseType={approveLicenseTypeModal}
				onApprove={handleApproveLicenseType}
			/>

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
								Are you sure you want to delete this {deleteConfirmModal.type === 'profession' ? 'profession' : 'license type'}?
							</p>
							<div className="alert alert-warning">
								<i className="mdi mdi-alert me-2"></i>
								<strong>{deleteConfirmModal.item.name}</strong>
							</div>
							{deleteConfirmModal.type === 'profession' && (
								<p className="text-danger">
									<strong>Warning:</strong> All associated license types will also be deleted.
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
