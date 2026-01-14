import { useState, useEffect } from 'react';
import { Button, Collapse, Alert, Spinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import ProfessionTypeSelector from '@/app/shared/components/create-project/ProfessionTypeSelector';
import projectService from '@/services/projectService';
import { useToast } from '@/contexts';

interface AddProfessionTypesSectionProps {
	projectId: number;
	currentProfessionTypeIds: number[];
	onSuccess: () => void;
	canEdit: boolean;
}

const AddProfessionTypesSection = ({
	projectId,
	currentProfessionTypeIds,
	onSuccess,
	canEdit
}: AddProfessionTypesSectionProps) => {
	const [showAddSection, setShowAddSection] = useState(false);
	const [selectedProfessionTypeIds, setSelectedProfessionTypeIds] = useState<number[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const { showSuccess, showError } = useToast();

	// Reset selected IDs when section is opened
	useEffect(() => {
		if (showAddSection) {
			setSelectedProfessionTypeIds([]);
		}
	}, [showAddSection]);

	// Filter out already selected profession types
	const availableProfessionTypeIds = selectedProfessionTypeIds.filter(
		id => !currentProfessionTypeIds.includes(id)
	);

	const handleConfirm = async () => {
		if (availableProfessionTypeIds.length === 0) {
			showError('Validation Error', 'Please select at least one new profession type');
			return;
		}

		setIsSaving(true);
		try {
			await projectService.updateProjectProfessionTypes(projectId, availableProfessionTypeIds);
			showSuccess('Success', `Successfully added ${availableProfessionTypeIds.length} profession type(s)`);
			setShowAddSection(false);
			onSuccess();
		} catch (error) {
			console.error('Failed to add profession types:', error);
			showError('Error', 'Failed to add profession types. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setShowAddSection(false);
		setSelectedProfessionTypeIds([]);
	};

	if (!canEdit) {
		return null;
	}

	return (
		<div className="add-profession-types-section">
			<Collapse in={showAddSection}>
				<div className="card mb-3">
					<div className="card-body">
						<h6 className="mb-3">Select Additional Profession Types</h6>

						{currentProfessionTypeIds.length > 0 && (
							<Alert variant="info" className="mb-3">
								<Icon icon="mdi:information-outline" width={18} className="me-2" />
								Already selected profession types will be filtered out automatically.
							</Alert>
						)}

						<ProfessionTypeSelector
							value={selectedProfessionTypeIds}
							onChange={setSelectedProfessionTypeIds}
						/>

						{selectedProfessionTypeIds.length > 0 && availableProfessionTypeIds.length === 0 && (
							<Alert variant="warning" className="mt-3 mb-0">
								<Icon icon="mdi:alert" width={18} className="me-2" />
								All selected profession types are already added to this project.
							</Alert>
						)}

						<div className="d-flex justify-content-end gap-2 mt-3">
							<Button
								variant="light"
								onClick={handleCancel}
								disabled={isSaving}
							>
								Cancel
							</Button>
							<Button
								variant="primary"
								onClick={handleConfirm}
								disabled={isSaving || availableProfessionTypeIds.length === 0}
							>
								{isSaving ? (
									<>
										<Spinner animation="border" size="sm" className="me-2" />
										Adding...
									</>
								) : (
									<>
										<Icon icon="mdi:check" width={18} className="me-1" />
										Add {availableProfessionTypeIds.length > 0 && `(${availableProfessionTypeIds.length})`}
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</Collapse>

			<Button
				variant="outline-primary"
				size="sm"
				onClick={() => setShowAddSection(!showAddSection)}
				disabled={isSaving}
				title="Add profession types"
			>
				<Icon icon="mdi:plus" width={16} />
			</Button>
		</div>
	);
};

export default AddProfessionTypesSection;
