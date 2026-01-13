import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import licenseRequestService from '@/services/licenseRequestService';
import lookupService from '@/services/lookupService';
import type { CreateLicenseRequest } from '@/types/licenseRequest';
import type { State, Profession, ProfessionType, LicenseRequirement } from '@/types/lookup';

interface AddLicenseRequestModalProps {
	show: boolean;
	onHide: () => void;
	onSuccess: () => void;
}

const AddLicenseRequestModal = ({ show, onHide, onSuccess }: AddLicenseRequestModalProps) => {
	const { showSuccess, showError } = useToast();
	
	// Cascade dropdown state
	const [professions, setProfessions] = useState<Profession[]>([]);
	const [loadingProfessions, setLoadingProfessions] = useState(true);
	const [selectedProfessionId, setSelectedProfessionId] = useState<number>(0);

	const [professionTypes, setProfessionTypes] = useState<ProfessionType[]>([]);
	const [loadingProfessionTypes, setLoadingProfessionTypes] = useState(false);
	const [selectedProfessionTypeId, setSelectedProfessionTypeId] = useState<number>(0);

	const [licenseRequirements, setLicenseRequirements] = useState<LicenseRequirement[]>([]);
	const [loadingLicenseRequirements, setLoadingLicenseRequirements] = useState(false);
	const [selectedLicenseRequirement, setSelectedLicenseRequirement] = useState<LicenseRequirement | null>(null);
	
	// Form state
	const [states, setStates] = useState<State[]>([]);
	const [statesLoading, setStatesLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [formData, setFormData] = useState<Partial<CreateLicenseRequest>>({
		licenseTypeId: 0,
		state: '',
		issuingAuthority: '',
		issueDate: '',
		expirationDate: '',
		licenseNumber: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (show) {
			loadProfessions();
			fetchStates();
		}
	}, [show]);

	const loadProfessions = async () => {
		setLoadingProfessions(true);
		try {
			const data = await lookupService.getProfessions();
			setProfessions(data);
		} catch (error) {
			showError('Error', 'Failed to load professions');
		} finally {
			setLoadingProfessions(false);
		}
	};

	const loadProfessionTypes = async (professionId: number) => {
		setLoadingProfessionTypes(true);
		try {
			const data = await lookupService.getProfessionTypes({ professionId });
			setProfessionTypes(data);
		} catch (error) {
			showError('Error', 'Failed to load profession types');
		} finally {
			setLoadingProfessionTypes(false);
		}
	};

	const loadLicenseRequirements = async (professionTypeId: number) => {
		setLoadingLicenseRequirements(true);
		try {
			const data = await lookupService.getLicenseRequirements(professionTypeId);
			setLicenseRequirements(data);
		} catch (error) {
			showError('Error', 'Failed to load license requirements');
		} finally {
			setLoadingLicenseRequirements(false);
		}
	};

	const fetchStates = async () => {
		try {
			setStatesLoading(true);
			const data = await lookupService.getStates();
			setStates(data);
		} catch (error) {
			showError('Error', 'Failed to load states');
		} finally {
			setStatesLoading(false);
		}
	};

	const handleProfessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const professionId = parseInt(e.target.value);
		setSelectedProfessionId(professionId);
		
		// Reset dependent fields
		setSelectedProfessionTypeId(0);
		setSelectedLicenseRequirement(null);
		setProfessionTypes([]);
		setLicenseRequirements([]);
		setFormData(prev => ({ ...prev, licenseTypeId: 0 }));
		setErrors(prev => ({ ...prev, licenseTypeId: '' }));
		
		// Load profession types if profession selected
		if (professionId > 0) {
			loadProfessionTypes(professionId);
		}
	};

	const handleProfessionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const professionTypeId = parseInt(e.target.value);
		setSelectedProfessionTypeId(professionTypeId);
		
		// Reset dependent fields
		setSelectedLicenseRequirement(null);
		setLicenseRequirements([]);
		setFormData(prev => ({ ...prev, licenseTypeId: 0 }));
		setErrors(prev => ({ ...prev, licenseTypeId: '' }));
		
		// Load license requirements if profession type selected
		if (professionTypeId > 0) {
			loadLicenseRequirements(professionTypeId);
		}
	};

	const handleLicenseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const licenseTypeId = parseInt(e.target.value);
		
		if (licenseTypeId > 0) {
			const requirement = licenseRequirements.find(r => r.licenseTypeId === licenseTypeId);
			setSelectedLicenseRequirement(requirement || null);
			setFormData(prev => ({ ...prev, licenseTypeId }));
			setErrors(prev => ({ ...prev, licenseTypeId: '' }));
		} else {
			setSelectedLicenseRequirement(null);
			setFormData(prev => ({ ...prev, licenseTypeId: 0 }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.licenseTypeId || formData.licenseTypeId === 0) {
			newErrors.licenseTypeId = 'License type is required';
		}

		if (!formData.state?.trim()) {
			newErrors.state = 'State is required';
		}

		if (!formData.issuingAuthority?.trim()) {
			newErrors.issuingAuthority = 'Issuing authority is required';
		}

		if (!formData.issueDate) {
			newErrors.issueDate = 'Issue date is required';
		}

		if (!formData.expirationDate) {
			newErrors.expirationDate = 'Expiration date is required';
		}

		if (!formData.licenseNumber?.trim()) {
			newErrors.licenseNumber = 'License number is required';
		}

		if (!file) {
			newErrors.file = 'License file is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm() || !file) {
			return;
		}

		setLoading(true);
		try {
			const requestData: CreateLicenseRequest = {
				professionTypeId: selectedProfessionTypeId,
				licenseTypeId: formData.licenseTypeId!,
				state: formData.state!,
				issuingAuthority: formData.issuingAuthority!,
				issueDate: formData.issueDate!,
				expirationDate: formData.expirationDate!,
				licenseNumber: formData.licenseNumber!,
				file: file,
			};

			await licenseRequestService.createLicenseRequest(requestData);
			showSuccess('Success', 'License request submitted successfully. Awaiting admin verification.');
			onSuccess();
			resetForm();
		} catch (error: any) {
			showError('Error', error.response?.data?.message || 'Failed to submit license request');
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			licenseTypeId: 0,
			state: '',
			issuingAuthority: '',
			issueDate: '',
			expirationDate: '',
			licenseNumber: '',
		});
		setFile(null);
		setErrors({});
		setSelectedProfessionId(0);
		setSelectedProfessionTypeId(0);
		setSelectedLicenseRequirement(null);
		setProfessionTypes([]);
		setLicenseRequirements([]);
	};

	const handleClose = () => {
		if (!loading) {
			resetForm();
			onHide();
		}
	};

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>Add Professional License</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
					<Alert variant="info" className="mb-3">
						<i className="mdi mdi-information-outline me-2"></i>
						Your license will be verified by an administrator before being added to your profile.
					</Alert>

					{/* Cascade Dropdown 1: Profession */}
					<Form.Group className="mb-3">
						<Form.Label>
							Select Profession <span className="text-danger">*</span>
						</Form.Label>
						{loadingProfessions ? (
							<div className="d-flex align-items-center">
								<Spinner animation="border" size="sm" className="me-2" />
								<span className="text-muted">Loading professions...</span>
							</div>
						) : (
							<Form.Select
								value={selectedProfessionId || ''}
								onChange={handleProfessionChange}
								disabled={loading}
							>
								<option value="">Select profession...</option>
								{professions.map((profession) => (
									<option key={`profession-${profession.id}`} value={profession.id}>
										{profession.name}
									</option>
								))}
							</Form.Select>
						)}
					</Form.Group>

					{/* Cascade Dropdown 2: ProfessionType */}
					{selectedProfessionId > 0 && (
						<Form.Group className="mb-3">
							<Form.Label>
								Select Profession Type <span className="text-danger">*</span>
							</Form.Label>
							{loadingProfessionTypes ? (
								<div className="d-flex align-items-center">
									<Spinner animation="border" size="sm" className="me-2" />
									<span className="text-muted">Loading profession types...</span>
								</div>
							) : (
								<Form.Select
									value={selectedProfessionTypeId || ''}
									onChange={handleProfessionTypeChange}
									disabled={loading}
								>
									<option value="">Select profession type...</option>
									{professionTypes.map((professionType) => (
										<option key={`professionType-${professionType.id}`} value={professionType.id}>
											{professionType.name}
											{professionType.requiresStateLicense ? ' 🏛️' : ''}
											{` (${professionType.licenseRequirementsCount} licenses)`}
										</option>
									))}
								</Form.Select>
							)}
						</Form.Group>
					)}

					{/* Cascade Dropdown 3: License */}
					{selectedProfessionTypeId > 0 && (
						<Form.Group className="mb-3">
							<Form.Label>
								Select License <span className="text-danger">*</span>
							</Form.Label>
							{loadingLicenseRequirements ? (
								<div className="d-flex align-items-center">
									<Spinner animation="border" size="sm" className="me-2" />
									<span className="text-muted">Loading licenses...</span>
								</div>
							) : (
								<>
									<Form.Select
										value={selectedLicenseRequirement?.licenseTypeId || ''}
										onChange={handleLicenseChange}
										isInvalid={!!errors.licenseTypeId}
										disabled={loading}
									>
										<option value="">Select license...</option>
										{licenseRequirements.map((requirement) => (
											<option key={`license-${requirement.licenseTypeId}`} value={requirement.licenseTypeId}>
												{requirement.licenseTypeName}
												{requirement.isRequired ? ' ⚠️ Required' : ' ℹ️ Optional'}
												{requirement.isStateSpecific ? ' 📍 State-specific' : ''}
											</option>
										))}
									</Form.Select>
									<Form.Control.Feedback type="invalid">{errors.licenseTypeId}</Form.Control.Feedback>
								</>
							)}
							
							{/* Show notes if license selected and has notes */}
							{selectedLicenseRequirement?.notes && (
								<Alert variant="info" className="mt-2 mb-0 py-2">
									<small>
										<i className="mdi mdi-information-outline me-1"></i>
										<strong>Note:</strong> {selectedLicenseRequirement.notes}
									</small>
								</Alert>
							)}
						</Form.Group>
					)}

					{/* License Details Form - only show when license is selected */}
					{selectedLicenseRequirement && (
						<>
							<hr className="my-3" />
							<div className="mb-3">
								<h6 className="text-muted">License Details</h6>
							</div>

							<Form.Group className="mb-3">
								<Form.Label>
									State <span className="text-danger">*</span>
								</Form.Label>
								<Form.Select
									value={formData.state || ''}
									onChange={(e) => setFormData({ ...formData, state: e.target.value })}
									isInvalid={!!errors.state}
									disabled={loading || statesLoading}
								>
									<option value="">Select state...</option>
									{states.map((state) => (
										<option key={`state-${state.value}`} value={state.value}>
											{state.label}
										</option>
									))}
								</Form.Select>
								<Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>
									Issuing Authority <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="e.g., NCEES, State Board of Engineering"
									value={formData.issuingAuthority || ''}
									onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
									isInvalid={!!errors.issuingAuthority}
									disabled={loading}
									maxLength={200}
								/>
								<Form.Control.Feedback type="invalid">{errors.issuingAuthority}</Form.Control.Feedback>
							</Form.Group>

							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>
											Issue Date <span className="text-danger">*</span>
										</Form.Label>
										<Form.Control
											type="date"
											value={formData.issueDate || ''}
											onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
											isInvalid={!!errors.issueDate}
											disabled={loading}
										/>
										<Form.Control.Feedback type="invalid">{errors.issueDate}</Form.Control.Feedback>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>
											Expiration Date <span className="text-danger">*</span>
										</Form.Label>
										<Form.Control
											type="date"
											value={formData.expirationDate || ''}
											onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
											isInvalid={!!errors.expirationDate}
											disabled={loading}
										/>
										<Form.Control.Feedback type="invalid">{errors.expirationDate}</Form.Control.Feedback>
									</Form.Group>
								</div>
							</div>

							<Form.Group className="mb-3">
								<Form.Label>
									License Number <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter license number"
									value={formData.licenseNumber || ''}
									onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
									isInvalid={!!errors.licenseNumber}
									disabled={loading}
									maxLength={100}
								/>
								<Form.Control.Feedback type="invalid">{errors.licenseNumber}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>
									Upload License Document <span className="text-danger">*</span>
								</Form.Label>
								<Form.Control
									type="file"
									accept=".pdf,.jpg,.jpeg,.png"
									onChange={(e: any) => setFile(e.target.files?.[0] || null)}
									isInvalid={!!errors.file}
									disabled={loading}
								/>
								<Form.Text className="text-muted">
									Accepted formats: PDF, JPG, PNG (Max 10MB)
								</Form.Text>
								<Form.Control.Feedback type="invalid">{errors.file}</Form.Control.Feedback>
							</Form.Group>
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button 
						variant="primary" 
						type="submit" 
						disabled={loading || !selectedLicenseRequirement}
					>
						{loading ? (
							<>
								<Spinner as="span" animation="border" size="sm" className="me-2" />
								Submitting...
							</>
						) : (
							<>
								<i className="mdi mdi-send me-1"></i>
								Submit for Verification
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default AddLicenseRequestModal;
