import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import type { Profession, LicenseType } from '@/types/dictionary';

interface LicenseTypeModalProps {
	show: boolean;
	onHide: () => void;
	profession: Profession | null;
	availableLicenseTypes: LicenseType[];
	selectedLicenseTypes: LicenseType[];
	onConfirm: (selectedIds: number[]) => void;
}

const LicenseTypeModal = ({
	show,
	onHide,
	profession,
	availableLicenseTypes,
	selectedLicenseTypes,
	onConfirm,
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
				<Row>{checkboxes}</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Cancel
				</Button>
				<Button variant="outline-danger" onClick={handleClearAll}>
					Clear All
				</Button>
				<Button variant="primary" onClick={handleConfirm}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default LicenseTypeModal;
