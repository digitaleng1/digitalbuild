import { useState } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import ClientSelector from '@/app/shared/components/create-project/ClientSelector';
import projectService from '@/services/projectService';
import { useToast } from '@/contexts';

interface ChangeClientModalProps {
	show: boolean;
	onHide: () => void;
	projectId: number;
	currentClientId: string;
	currentClientName: string;
	onSuccess: () => void;
}

const ChangeClientModal = ({
	show,
	onHide,
	projectId,
	currentClientId,
	currentClientName,
	onSuccess
}: ChangeClientModalProps) => {
	const [newClientId, setNewClientId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { showSuccess, showError } = useToast();

	const handleSubmit = async () => {
		if (!newClientId || newClientId === currentClientId) {
			return;
		}

		setLoading(true);
		try {
			await projectService.changeProjectClient(projectId, newClientId);
			showSuccess('Client Changed', 'Project client has been updated successfully');
			onSuccess();
			onHide();
		} catch (err: unknown) {
			const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change client';
			showError('Change Failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setNewClientId(null);
		onHide();
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Change Project Client</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Alert variant="info">
					<i className="mdi mdi-information-outline me-1"></i>
					Current client: <strong>{currentClientName}</strong>
				</Alert>

				<ClientSelector
					value={newClientId || undefined}
					onChange={setNewClientId}
					disabled={loading}
					required={true}
				/>

				<Alert variant="warning" className="mb-0">
					<i className="mdi mdi-alert-outline me-1"></i>
					<strong>Warning:</strong> Changing the client will reassign all project data to the new client.
				</Alert>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="light" onClick={handleClose} disabled={loading}>
					Cancel
				</Button>
				<Button 
					variant="primary" 
					onClick={handleSubmit} 
					disabled={loading || !newClientId || newClientId === currentClientId}
				>
					{loading ? (
						<>
							<Spinner size="sm" className="me-1" />
							Changing...
						</>
					) : (
						'Change Client'
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ChangeClientModal;
