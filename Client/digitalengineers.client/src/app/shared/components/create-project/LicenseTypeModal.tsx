import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import type { Profession, LicenseType } from '@/types/lookup';

interface LicenseTypeModalProps {
	show: boolean;
	onHide: () => void;
	profession: Profession | null;
	availableLicenseTypes: LicenseType[];
	selectedLicenseTypes: LicenseType[];
	onConfirm: (selectedIds: number[]) => void;
	onCreateNew?: () => void;
}

const LicenseTypeModal = ({
	show,
	onHide,
	profession,
	availableLicenseTypes,
	selectedLicenseTypes,
	onConfirm,
	onCreateNew,
}: LicenseTypeModalProps) => {
	const [tempSelected, setTempSelected] = useState<number[]>([]);

	useEffect(() => {
		if (show) {
			setTempSelected(selectedLicenseTypes.map((lt) => lt.id));
		}
	}, [show, selectedLicenseTypes]);

	const handleToggle = useCallback((licenseTypeId: number) => {
		setTempSelected((prev) =>
			prev.includes(licenseTypeId)
				? prev.filter((id) => id !== licenseTypeId)
				: [...prev, licenseTypeId]
		);
	}, []);

	const handleClearAll = useCallback(() => {
		setTempSelected([]);
	}, []);

	const handleConfirm = useCallback(() => {
		onConfirm(tempSelected);
		onHide();
	}, [tempSelected, onConfirm, onHide]);

	const checkboxes = useMemo(
		() =>
			availableLicenseTypes.map((licenseType) => (
				<Col md={6} key={licenseType.id} className="mb-2">
					<Form.Check
						type="checkbox"
						id={`license-type-${licenseType.id}`}
						label={licenseType.name}
						checked={tempSelected.includes(licenseType.id)}
						onChange={() => handleToggle(licenseType.id)}
					/>
				</Col>
			)),
		[availableLicenseTypes, tempSelected, handleToggle]
	);

	if (!profession) return null;

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>Select {profession.name} License Types</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{availableLicenseTypes.length === 0 ? (
					<div className="text-center py-4">
						<i className="mdi mdi-alert-circle-outline text-muted" style={{ fontSize: '48px' }}></i>
						<p className="text-muted mt-2">No license types available for this profession.</p>
						{onCreateNew && (
							<Button variant="success" onClick={onCreateNew}>
								<i className="mdi mdi-plus-circle me-1"></i>
								Create New License Type
							</Button>
						)}
					</div>
				) : (
					<Row>{checkboxes}</Row>
				)}
			</Modal.Body>
			<Modal.Footer>
				{availableLicenseTypes.length > 0 && onCreateNew && (
					<Button variant="success" onClick={onCreateNew} className="me-auto">
						<i className="mdi mdi-plus-circle me-1"></i>
						Create New
					</Button>
				)}
				<Button variant="secondary" onClick={onHide}>
					Cancel
				</Button>
				{availableLicenseTypes.length > 0 && (
					<>
						<Button variant="outline-danger" onClick={handleClearAll}>
							Clear All
						</Button>
						<Button variant="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default LicenseTypeModal;
