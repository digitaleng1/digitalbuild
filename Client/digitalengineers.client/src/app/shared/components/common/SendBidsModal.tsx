import { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAvailableSpecialists } from '@/app/shared/hooks';
import { InviteSpecialistModal } from '@/app/shared/components/bids';
import FileUploader from '@/components/FileUploader';
import type { ProfessionType, LicenseType } from '@/types/lookup';
import type { BidFormData, ProfessionTypeInfo } from '@/types/bid';
import type { InviteSpecialistResult } from '@/types/specialist-invitation';
import bidService from '@/services/bidService';
import { useToast } from '@/contexts';
import { getErrorMessage, getErrorTitle } from '@/utils/errorHandler';
import './SendBidsModal.scss';

interface SendBidsModalProps {
	show: boolean;
	onHide: () => void;
	projectId: number;
	professionTypes: ProfessionType[];
	licenseTypes?: LicenseType[];
	onSuccess?: () => void;
}

const SendBidsModal = ({
	show,
	onHide,
	projectId,
	professionTypes,
	licenseTypes = [],
	onSuccess,
}: SendBidsModalProps) => {
	const { specialists, loading, error, refetch } = useAvailableSpecialists(show ? projectId : undefined);
	const { showSuccess, showError } = useToast();

	const [selectedSpecialists, setSelectedSpecialists] = useState<Set<string>>(new Set());
	const [selectedProfessionTypeFilters, setSelectedProfessionTypeFilters] = useState<Set<number>>(new Set());
	const [formData, setFormData] = useState<BidFormData>({
		description: '',
	});
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showInviteModal, setShowInviteModal] = useState(false);
	const [uploadingFiles, setUploadingFiles] = useState(false);

	// Initialize with all profession types selected
	useEffect(() => {
		if (show && professionTypes.length > 0) {
			setSelectedProfessionTypeFilters(new Set(professionTypes.map(pt => pt.id)));
		}
	}, [show, professionTypes]);

	// Filter specialists by professionTypeIds
	const filteredSpecialists = useMemo(() => {
		// If no filters selected, return empty list (user must select at least one filter)
		if (selectedProfessionTypeFilters.size === 0) {
			return [];
		}

		return specialists.filter((specialist) =>
			specialist.professionTypeIds?.some((ptId) => selectedProfessionTypeFilters.has(ptId))
		);
	}, [specialists, selectedProfessionTypeFilters]);

	const selectedProfessionTypes = useMemo(() => {
		return professionTypes.filter((pt) => selectedProfessionTypeFilters.has(pt.id));
	}, [professionTypes, selectedProfessionTypeFilters]);

	const handleToggleSpecialist = useCallback((userId: string) => {
		setSelectedSpecialists((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(userId)) {
				newSet.delete(userId);
			} else {
				newSet.add(userId);
			}
			return newSet;
		});
	}, []);

	const handleProfessionTypeFilterChange = useCallback((professionTypeId: number) => {
		setSelectedProfessionTypeFilters((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(professionTypeId)) {
				newSet.delete(professionTypeId);
			} else {
				newSet.add(professionTypeId);
			}
			return newSet;
		});
	}, []);

	const handleSelectAll = useCallback(() => {
		const allUserIds = filteredSpecialists.map((s) => s.userId);
		setSelectedSpecialists(new Set(allUserIds));
	}, [filteredSpecialists]);

	const handleDeselectAll = useCallback(() => {
		setSelectedSpecialists(new Set());
	}, []);

	const handleInputChange = useCallback((field: keyof BidFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleInvitationSent = useCallback(async (result: InviteSpecialistResult) => {
		await refetch();
		setSelectedSpecialists(prev => new Set([...prev, result.specialistUserId]));
		showSuccess('Success', `Invitation sent to ${result.email}`);
	}, [refetch, showSuccess]);

	const isFormValid = useMemo(() => {
		return (
			selectedSpecialists.size > 0 &&
			formData.description.trim() !== ''
		);
	}, [selectedSpecialists, formData]);

	const handleSubmit = useCallback(async () => {
		if (!isFormValid) return;

		try {
			setIsSubmitting(true);

			const response = await bidService.sendBids({
				projectId,
				specialistUserIds: Array.from(selectedSpecialists),
				description: formData.description,
			});

			if (selectedFiles.length > 0 && response.bidRequestIds.length > 0) {
				setUploadingFiles(true);

				for (const bidRequestId of response.bidRequestIds) {
					for (const file of selectedFiles) {
						await bidService.uploadBidRequestAttachment(bidRequestId, {
							file,
							description: undefined
						});
					}
				}

				setUploadingFiles(false);
			}

			showSuccess(
				'Bid Requests Sent',
				`${selectedSpecialists.size} bid request(s) with ${selectedFiles.length} file(s) have been sent to specialists.`
			);

			setSelectedSpecialists(new Set());
			setSelectedProfessionTypeFilters(new Set());
			setFormData({ description: '' });
			setSelectedFiles([]);

			onSuccess?.();
			onHide();
		} catch (err: any) {
			const errorTitle = getErrorTitle(err);
			const errorMessage = getErrorMessage(err);
			showError(errorTitle, errorMessage);
		} finally {
			setIsSubmitting(false);
			setUploadingFiles(false);
		}
	}, [
		isFormValid,
		formData,
		projectId,
		selectedSpecialists,
		selectedFiles,
		showSuccess,
		showError,
		onSuccess,
		onHide,
	]);

	const renderSpecialistAvatar = (specialist: any) => {
		if (specialist.profilePictureUrl) {
			return (
				<img
					src={specialist.profilePictureUrl}
					alt={specialist.name}
					className="rounded-circle"
					style={{ width: '32px', height: '32px', objectFit: 'cover' }}
				/>
			);
		}

		const initial = specialist.name.charAt(0).toUpperCase();
		return (
			<div
				className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
				style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}
			>
				{initial}
			</div>
		);
	};

	return (
		<>
			<Modal show={show} onHide={onHide} size="xl" centered style={{ maxWidth: '100%', width: '100%', margin: '0 auto' }}>
				<Modal.Header closeButton>
					<Modal.Title>Send Bids to Specialists</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ height: '70vh', padding: 0 }}>
					{loading && (
						<div className="d-flex justify-content-center align-items-center h-100">
							<Spinner animation="border" role="status">
								<span className="visually-hidden">Loading specialists...</span>
							</Spinner>
						</div>
					)}

					{error && (
						<div className="p-4">
							<Alert variant="danger">
								<Alert.Heading>Error Loading Specialists</Alert.Heading>
								<p>{error}</p>
							</Alert>
						</div>
					)}

					{!loading && !error && (
						<Row className="g-0 h-100">
							{/* Left Column - Bid Details & Filters */}
							<Col md={3} className="border-end">
								<div className="px-3 py-2 h-100 d-flex flex-column" style={{ overflowY: 'auto' }}>
									<h5 className="mb-3">Bid Details</h5>

									<Form.Group className="mb-3">
										<Form.Label>
											Description / Responsibilities <span className="text-danger">*</span>
										</Form.Label>
										<Form.Control
											as="textarea"
											rows={6}
											placeholder="Describe the job responsibilities and requirements..."
											value={formData.description}
											onChange={(e) => handleInputChange('description', e.target.value)}
											required
										/>
										<Form.Text className="text-muted">
											This description will be sent to all selected specialists.
										</Form.Text>
									</Form.Group>

									<div className="mb-3">
										<div className="d-flex align-items-center gap-2">
											<Form.Label className="mb-0">Selected Specialists:</Form.Label>
											<span className="fw-bold text-primary">{selectedSpecialists.size}</span>
										</div>
									</div>

									<hr />

									<div className="flex-grow-1">
										<h6 className="mb-3">
											<i className="mdi mdi-information-outline me-2"></i>
											Filter by Profession Types:
										</h6>
										
										{/* Profession Type Switches */}
										<div className="d-flex flex-column gap-1">
											{professionTypes.map((pt) => (
												<Form.Check
													key={pt.id}
													type="switch"
													id={`filter-switch-${pt.id}`}
													label={pt.name}
													checked={selectedProfessionTypeFilters.has(pt.id)}
													onChange={() => handleProfessionTypeFilterChange(pt.id)}
													className="user-select-none"
												/>
											))}
										</div>
									</div>
								</div>
							</Col>

							{/* Middle Column - Specialists List */}
							<Col md={6} className="border-end">
								<div className="h-100 d-flex flex-column">
									<div className="p-2 border-bottom bg-light">
										<div className="d-flex justify-content-between align-items-center">
											<h6 className="mb-0">
												Available Specialists ({filteredSpecialists.length})
											</h6>
											<div className="d-flex gap-2">
												<Button
													variant="outline-success"
													size="sm"
													onClick={() => setShowInviteModal(true)}
													disabled={selectedProfessionTypes.length === 0}
												>
													<i className="mdi mdi-account-plus me-1"></i>
													Invite New
												</Button>
												<Button
													variant="outline-primary"
													size="sm"
													onClick={handleSelectAll}
													disabled={filteredSpecialists.length === 0}
												>
													Select All
												</Button>
												<Button
													variant="outline-secondary"
													size="sm"
													onClick={handleDeselectAll}
													disabled={selectedSpecialists.size === 0}
												>
													Deselect All
												</Button>
											</div>
										</div>
									</div>

									<div className="flex-grow-1 p-2" style={{ overflowY: 'auto', maxHeight: 'calc(70vh - 60px)' }}>
										{filteredSpecialists.length === 0 && (
											<Alert variant="info" className="mb-0">
												No specialists found matching the selected filters.
											</Alert>
										)}

										{filteredSpecialists.length > 0 && (
											<div className="d-flex flex-column gap-1">
												{filteredSpecialists.map((specialist) => (
													<div
														key={specialist.userId}
														className={`d-flex align-items-center p-2 border rounded ${
															selectedSpecialists.has(specialist.userId)
																? 'bg-primary bg-opacity-10 border-primary'
															: 'bg-primary bg-opacity-10'
														}`}
														style={{ cursor: 'pointer' }}
														onClick={() => handleToggleSpecialist(specialist.userId)}
													>
														<Form.Check
															type="checkbox"
															checked={selectedSpecialists.has(specialist.userId)}
															onChange={() => handleToggleSpecialist(specialist.userId)}
															className="me-2"
															onClick={(e) => e.stopPropagation()}
														/>
														<div className="me-2">{renderSpecialistAvatar(specialist)}</div>
														<div className="flex-grow-1 min-w-0">
															<div className="d-flex justify-content-between align-items-center">
																<div className="min-w-0 flex-grow-1">
																	<h6 className="mb-0 text-truncate small">{specialist.name}</h6>
																	<div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
																		<span className="text-truncate">{specialist.email}</span>
																		{specialist.location && (
																			<>
																				<span>•</span>
																				<span className="text-truncate">{specialist.location}</span>
																			</>
																		)}
																	</div>
																</div>
																{specialist.isAvailableForHire && (
																	<Badge bg="success" className="ms-2 flex-shrink-0" style={{ fontSize: '0.65rem' }}>
																		Available
																	</Badge>
																)}
															</div>
															<div className="mt-1">
																{specialist.professionTypes?.slice(0, 3).map((pt: ProfessionTypeInfo) => (
																	<Badge
																		key={pt.professionTypeId}
																		bg="secondary"
																		className="me-1"
																		style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}
																	>
																		{pt.professionTypeName}
																	</Badge>
																))}
																{(specialist.professionTypes?.length || 0) > 3 && (
																	<Badge
																		bg="secondary"
																		className="me-1"
																		style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}
																	>
																		+{specialist.professionTypes.length - 3}
																	</Badge>
																)}
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							</Col>

							{/* Right Column - File Uploader */}
							<Col md={3}>
								<div className="px-3 py-2 h-100 d-flex flex-column" style={{ overflowY: 'auto' }}>
									<h5 className="mb-3">Attachments</h5>
									
									<Form.Group className="mb-3">
										<FileUploader
											label="Attach Files (Optional)"
											helpText="Upload documents, drawings, or specifications"
											maxFiles={5}
											maxFileSize={10}
											acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.dwg', '.dxf']}
											onFilesChange={setSelectedFiles}
											value={selectedFiles}
											showFileList={true}
										/>
									</Form.Group>
								</div>
							</Col>
						</Row>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSubmit}
						disabled={!isFormValid || isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
									className="me-2"
								/>
								{uploadingFiles ? 'Uploading Files...' : 'Sending...'}
							</>
						) : (
							<>
								Send Bids ({selectedSpecialists.size}
								{selectedFiles.length > 0 && `, ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`})
							</>
						)}
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Invite Specialist Modal - pass first license type from project */}
			{selectedProfessionTypes.length > 0 && licenseTypes.length > 0 && (
				<InviteSpecialistModal
					show={showInviteModal}
					onHide={() => setShowInviteModal(false)}
					licenseType={licenseTypes[0]}
					onInvitationSent={handleInvitationSent}
				/>
			)}
		</>
	);
};

export default SendBidsModal;
