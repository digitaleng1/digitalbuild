import { useState, useEffect } from 'react';
import { Modal, Button, Form, Badge, Spinner, Alert, ListGroup, Collapse } from 'react-bootstrap';
import type { Profession, ProfessionType, LicenseRequirement } from '@/types/lookup';
import lookupService from '@/services/lookupService';

interface ProfessionTypeModalProps {
	show: boolean;
	onHide: () => void;
	profession: Profession | null;
	selectedProfessionTypeIds: number[];
	onConfirm: (selectedIds: number[]) => void;
}

const ProfessionTypeModal = ({ 
	show, 
	onHide, 
	profession, 
	selectedProfessionTypeIds, 
	onConfirm 
}: ProfessionTypeModalProps) => {
	const [professionTypes, setProfessionTypes] = useState<ProfessionType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [localSelection, setLocalSelection] = useState<number[]>([]);
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
	const [licenseRequirements, setLicenseRequirements] = useState<Record<number, LicenseRequirement[]>>({});
	const [loadingLicenses, setLoadingLicenses] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (show && profession) {
			loadProfessionTypes();
		}
	}, [show, profession]);

	useEffect(() => {
		if (show && profession && professionTypes.length > 0) {
			// Initialize local selection with only IDs that belong to current profession
			const currentProfessionTypeIds = professionTypes.map(pt => pt.id);
			const selectedFromCurrentProfession = selectedProfessionTypeIds.filter(
				id => currentProfessionTypeIds.includes(id)
			);
			setLocalSelection(selectedFromCurrentProfession);
		}
	}, [show, profession, professionTypes, selectedProfessionTypeIds]);

	const loadProfessionTypes = async () => {
		if (!profession) return;
		
		setLoading(true);
		setError(null);
		try {
			const types = await lookupService.getProfessionTypes({ professionId: profession.id });
			setProfessionTypes(types);
		} catch (err) {
			console.error('Failed to load profession types:', err);
			setError('Failed to load profession types. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const loadLicenseRequirements = async (professionTypeId: number) => {
		if (licenseRequirements[professionTypeId]) {
			return;
		}

		setLoadingLicenses(prev => new Set(prev).add(professionTypeId));
		
		try {
			const requirements = await lookupService.getLicenseRequirements(professionTypeId);
			setLicenseRequirements(prev => ({
				...prev,
				[professionTypeId]: requirements
			}));
		} catch (err) {
			console.error('Failed to load license requirements:', err);
		} finally {
			setLoadingLicenses(prev => {
				const newSet = new Set(prev);
				newSet.delete(professionTypeId);
				return newSet;
			});
		}
	};

	const handleToggle = (typeId: number) => {
		setLocalSelection((prev) =>
			prev.includes(typeId)
				? prev.filter((id) => id !== typeId)
				: [...prev, typeId]
		);
	};

	const toggleExpand = async (id: number) => {
		const isExpanding = !expandedItems.has(id);
		
		setExpandedItems(prev => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});

		if (isExpanding) {
			await loadLicenseRequirements(id);
		}
	};

	const handleClearAll = () => {
		setLocalSelection([]);
	};

	const handleConfirm = () => {
		// Combine with other selected profession types (from other professions)
		const otherProfessionTypeIds = selectedProfessionTypeIds.filter(
			(id) => !professionTypes.some((pt) => pt.id === id)
		);
		onConfirm([...otherProfessionTypeIds, ...localSelection]);
		onHide();
	};

	const selectedCount = localSelection.length;
	const canConfirm = selectedCount > 0 || selectedProfessionTypeIds.length > 0;

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>
					Select Profession Types
					{profession && (
						<>
							{' '}
							for <Badge bg="primary">{profession.name}</Badge>
						</>
					)}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{loading && (
					<div className="text-center py-4">
						<Spinner animation="border" variant="primary" />
						<p className="mt-2 text-muted">Loading profession types...</p>
					</div>
				)}

				{error && (
					<Alert variant="danger" dismissible onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				{!loading && !error && professionTypes.length === 0 && (
					<Alert variant="info">
						No profession types found for this profession.
					</Alert>
				)}

				{!loading && !error && professionTypes.length > 0 && (
					<>
						<p className="text-muted mb-3">
							Select the profession types you need for your project:
						</p>
						<ListGroup>
							{professionTypes.map((pt) => {
								const isSelected = localSelection.includes(pt.id);
								const isExpanded = expandedItems.has(pt.id);
								const isLoadingLicenses = loadingLicenses.has(pt.id);
								const requirements = licenseRequirements[pt.id] || [];
								
								return (
									<div key={pt.id}>
										<ListGroup.Item
											className="d-flex align-items-center border-start-3"
											style={{ 
												cursor: 'pointer',
												borderLeft: `3px solid ${isSelected ? '#0d6efd' : 'transparent'}`,
												transition: 'all 0.2s ease'
											}}
										>
											<Form.Check
												type="switch"
												id={`switch-${pt.id}`}
												checked={isSelected}
												onChange={() => handleToggle(pt.id)}
												onClick={(e) => e.stopPropagation()}
												className="me-3"
												style={{ marginBottom: 0 }}
											/>
											
											<div 
												className="flex-grow-1"
												onClick={() => handleToggle(pt.id)}
											>
												<div className="d-flex align-items-center">
													<span className="fw-medium">{pt.name}</span>
													{pt.code && (
														<Badge bg="secondary" className="ms-2">
															{pt.code}
														</Badge>
													)}
													{pt.requiresStateLicense && (
														<Badge bg="warning" text="dark" className="ms-2">
															State License
														</Badge>
													)}
													{pt.licenseRequirementsCount > 0 && (
														<Badge bg="secondary" className="ms-2">
															{pt.licenseRequirementsCount} license{pt.licenseRequirementsCount !== 1 ? 's' : ''}
														</Badge>
													)}
												</div>
											</div>

											{pt.licenseRequirementsCount > 0 && (
												<Button
													variant="link"
													size="sm"
													className="p-0 text-muted"
													onClick={(e) => {
														e.stopPropagation();
														toggleExpand(pt.id);
													}}
													aria-label="Toggle license details"
													disabled={isLoadingLicenses}
												>
													{isLoadingLicenses ? (
														<Spinner animation="border" size="sm" />
													) : (
														<i 
															className={`mdi mdi-chevron-${isExpanded ? 'up' : 'down'}`}
															style={{ fontSize: '1.5rem' }}
														/>
													)}
												</Button>
											)}
										</ListGroup.Item>

										{pt.licenseRequirementsCount > 0 && (
											<Collapse in={isExpanded}>
												<div>
													{isLoadingLicenses ? (
														<div className="text-center py-3">
															<Spinner animation="border" size="sm" variant="primary" />
															<span className="ms-2 text-muted small">Loading licenses...</span>
														</div>
													) : requirements.length > 0 ? (
														<ListGroup variant="flush" className="ms-4">
															{requirements.map((lr) => (
																<ListGroup.Item 
																	key={lr.licenseTypeId}
																	className="py-2 border-0 bg-light"
																>
																	<div className="d-flex align-items-center">
																		<i className="mdi mdi-certificate text-primary me-2" />
																		<span className="text-muted small">{lr.licenseTypeName}</span>
																		<Badge 
																			bg={lr.isRequired ? 'danger' : 'info'} 
																			className="ms-2"
																		>
																			{lr.isRequired ? 'Required' : 'Optional'}
																		</Badge>
																		{lr.isStateSpecific && (
																			<Badge bg="warning" className="ms-1">
																				State License
																			</Badge>
																		)}
																	</div>
																</ListGroup.Item>
															))}
														</ListGroup>
													) : (
														<div className="ms-4 py-2 text-muted small">
															No license requirements found
														</div>
													)}
												</div>
											</Collapse>
										)}
									</div>
								);
							})}
						</ListGroup>
					</>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Cancel
				</Button>
				<Button variant="outline-danger" onClick={handleClearAll}>
					Clear All
				</Button>
				<Button variant="primary" onClick={handleConfirm} disabled={!canConfirm}>
					Confirm {selectedCount > 0 && `(${selectedCount})`}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ProfessionTypeModal;
