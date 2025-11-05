import { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAvailableSpecialists } from '@/app/shared/hooks';
import type { LicenseType } from '@/types/lookup';
import type { BidFormData } from '@/types/bid';
import bidService from '@/services/bidService';
import { useToast } from '@/contexts';
import { getErrorMessage, getErrorTitle } from '@/utils/errorHandler';

interface SendBidsModalProps {
	show: boolean;
	onHide: () => void;
	projectId: number;
	requiredLicenseTypes: LicenseType[];
	onSuccess?: () => void;
}

const SendBidsModal = ({
	show,
	onHide,
	projectId,
	requiredLicenseTypes,
	onSuccess,
}: SendBidsModalProps) => {
	const { specialists, loading, error } = useAvailableSpecialists(show ? projectId : undefined);
	const { showSuccess, showError } = useToast();

	// Selected specialists
	const [selectedSpecialists, setSelectedSpecialists] = useState<Set<string>>(new Set());

	// License type filters
	const [selectedLicenseFilters, setSelectedLicenseFilters] = useState<Set<number>>(new Set());

	// Bid form data
	const [formData, setFormData] = useState<BidFormData>({
		description: '',
	});

	// Submission state
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Filter specialists by selected license types
	const filteredSpecialists = useMemo(() => {
		if (selectedLicenseFilters.size === 0) {
			return specialists;
		}

		return specialists.filter((specialist) =>
			specialist.licenseTypes.some((lt) => selectedLicenseFilters.has(lt.id))
		);
	}, [specialists, selectedLicenseFilters]);

	// Toggle specialist selection
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

	// Toggle license filter
	const handleToggleLicenseFilter = useCallback((licenseId: number) => {
		setSelectedLicenseFilters((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(licenseId)) {
				newSet.delete(licenseId);
			} else {
				newSet.add(licenseId);
			}
			return newSet;
		});
	}, []);

	// Select all filtered specialists
	const handleSelectAll = useCallback(() => {
		const allUserIds = filteredSpecialists.map((s) => s.userId);
		setSelectedSpecialists(new Set(allUserIds));
	}, [filteredSpecialists]);

	// Deselect all specialists
	const handleDeselectAll = useCallback(() => {
		setSelectedSpecialists(new Set());
	}, []);

	// Handle form input changes
	const handleInputChange = useCallback((field: keyof BidFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	// Validate form
	const isFormValid = useMemo(() => {
		return (
			selectedSpecialists.size > 0 &&
			formData.description.trim() !== ''
		);
	}, [selectedSpecialists, formData]);

	// Submit bids
	const handleSubmit = useCallback(async () => {
		if (!isFormValid) return;

		try {
			setIsSubmitting(true);

			await bidService.sendBids({
				projectId,
				specialistUserIds: Array.from(selectedSpecialists),
				description: formData.description,
			});

			showSuccess(
				'Bid Requests Sent',
				`${selectedSpecialists.size} bid request(s) have been sent to specialists.`
			);

			// Reset form
			setSelectedSpecialists(new Set());
			setSelectedLicenseFilters(new Set());
			setFormData({ description: '' });

			onSuccess?.();
			onHide();
		} catch (err: any) {
			const errorTitle = getErrorTitle(err);
			const errorMessage = getErrorMessage(err);
			showError(errorTitle, errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	}, [
		isFormValid,
		formData,
		projectId,
		selectedSpecialists,
		showSuccess,
		showError,
		onSuccess,
		onHide,
	]);

	// Render specialist avatar
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
		<Modal show={show} onHide={onHide} size="xl" centered>
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
						<Col md={5} className="border-end">
							<div className="p-4 h-100 d-flex flex-column">
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
									<Form.Label>Selected Specialists</Form.Label>
									<div className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>
										{selectedSpecialists.size}
									</div>
								</div>

								<hr />

								<div className="flex-grow-1">
									<h6 className="mb-3">Filter by License Type:</h6>
									<div className="d-flex flex-column gap-2">
										{requiredLicenseTypes.map((lt) => (
											<Form.Check
												key={lt.id}
												type="checkbox"
												id={`filter-${lt.id}`}
												label={lt.name}
												checked={selectedLicenseFilters.has(lt.id)}
												onChange={() => handleToggleLicenseFilter(lt.id)}
												className="user-select-none"
											/>
										))}
									</div>
								</div>
							</div>
						</Col>

						{/* Right Column - Specialists List */}
						<Col md={7}>
							<div className="h-100 d-flex flex-column">
								<div className="p-2 border-bottom bg-light">
									<div className="d-flex justify-content-between align-items-center">
										<h6 className="mb-0">
											Available Specialists ({filteredSpecialists.length})
										</h6>
										<div>
											<Button
												variant="outline-primary"
												size="sm"
												onClick={handleSelectAll}
												className="me-2"
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
															: 'bg-white'
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
															{specialist.licenseTypes.slice(0, 3).map((lt) => (
																<Badge
																	key={lt.id}
																	bg="secondary"
																	className="me-1"
																	style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}
																>
																	{lt.name}
																</Badge>
															))}
															{specialist.licenseTypes.length > 3 && (
																<Badge
																	bg="secondary"
																	className="me-1"
																	style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}
																>
																	+{specialist.licenseTypes.length - 3}
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
							Sending...
						</>
					) : (
						`Send Bids (${selectedSpecialists.size})`
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SendBidsModal;
