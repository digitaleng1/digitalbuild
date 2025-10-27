import { useState } from 'react';
import { Card, Form, Button, Badge, Modal } from 'react-bootstrap';
import { useUpdateProjectStatus } from '@/app/shared/hooks';
import { getStatusBadgeVariant } from '@/utils/projectUtils';

interface ProjectStatusManagerProps {
	projectId: number;
	currentStatus: string;
	onStatusUpdated: () => void;
}

const ProjectStatusManager = ({ projectId, currentStatus, onStatusUpdated }: ProjectStatusManagerProps) => {
	const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
	const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
	const { isUpdating, updateStatus } = useUpdateProjectStatus();

	const statusOptions = [
		{ value: 'New', label: 'New' },
		{ value: 'Draft', label: 'Draft' },
		{ value: 'Published', label: 'Published' },
		{ value: 'InProgress', label: 'In Progress' },
		{ value: 'Completed', label: 'Completed' },
		{ value: 'Cancelled', label: 'Cancelled' },
	];

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedStatus(e.target.value);
	};

	const handleUpdateClick = () => {
		if (selectedStatus !== currentStatus) {
			setShowConfirmModal(true);
		}
	};

	const handleConfirmUpdate = async () => {
		try {
			await updateStatus(projectId, selectedStatus);
			setShowConfirmModal(false);
			onStatusUpdated();
		} catch (error) {
			// Error handled by hook
			setShowConfirmModal(false);
		}
	};

	const handleCancelUpdate = () => {
		setSelectedStatus(currentStatus);
		setShowConfirmModal(false);
	};

	const statusVariant = getStatusBadgeVariant(currentStatus);
	const hasChanged = selectedStatus !== currentStatus;

	return (
		<>
			<Card className="mb-3">
				<Card.Body>
					<h4 className="header-title mb-3">Project Status</h4>

					<div className="mb-3">
						<label className="form-label">Current Status</label>
						<div>
							<Badge bg={statusVariant} className="p-2" style={{ fontSize: '0.875rem' }}>
								{currentStatus}
							</Badge>
						</div>
					</div>

					<Form.Group className="mb-3">
						<Form.Label>Change Status</Form.Label>
						<Form.Select 
							value={selectedStatus} 
							onChange={handleStatusChange}
							disabled={isUpdating}
						>
							{statusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Form.Select>
					</Form.Group>

					<Button 
						variant="primary" 
						className="w-100"
						onClick={handleUpdateClick}
						disabled={!hasChanged || isUpdating}
					>
						{isUpdating ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								Updating...
							</>
						) : (
							'Update Status'
						)}
					</Button>
				</Card.Body>
			</Card>

			<Modal show={showConfirmModal} onHide={handleCancelUpdate} centered>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Status Change</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Are you sure you want to change the project status from <strong>{currentStatus}</strong> to <strong>{selectedStatus}</strong>?
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancelUpdate} disabled={isUpdating}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleConfirmUpdate} disabled={isUpdating}>
						{isUpdating ? 'Updating...' : 'Confirm'}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ProjectStatusManager;
