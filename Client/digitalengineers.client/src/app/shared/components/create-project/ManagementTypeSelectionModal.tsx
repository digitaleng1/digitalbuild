import { useState, useCallback } from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';
import { ProjectManagementType } from '@/types/project';

interface ManagementTypeSelectionModalProps {
	show: boolean;
	onHide: () => void;
	onConfirm: (managementType: ProjectManagementType) => void;
	isSubmitting?: boolean;
}

const ManagementTypeSelectionModal = ({
	show,
	onHide,
	onConfirm,
	isSubmitting = false,
}: ManagementTypeSelectionModalProps) => {
	const [selectedType, setSelectedType] = useState<ProjectManagementType | null>(null);

	const handleCardClick = useCallback((type: ProjectManagementType) => {
		setSelectedType(type);
	}, []);

	const handleConfirm = useCallback(() => {
		if (selectedType) {
			onConfirm(selectedType);
		}
	}, [selectedType, onConfirm]);

	const handleHide = useCallback(() => {
		setSelectedType(null);
		onHide();
	}, [onHide]);

	return (
		<Modal show={show} onHide={handleHide} size="lg" centered backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title>Choose Project Management Type</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className="text-muted mb-4">
					Select how you want to manage your project:
				</p>

				<Row>
					{/* Novobid Managed Option */}
					<Col md={6} className="mb-3 mb-md-0">
						<Card
							className={`h-100 cursor-pointer management-type-card ${
								selectedType === ProjectManagementType.DigitalEngineersManaged
									? 'border-primary'
									: 'border-light'
							}`}
							style={{
								borderWidth: selectedType === ProjectManagementType.DigitalEngineersManaged ? '2px' : '1px',
								transition: 'all 0.2s ease',
								cursor: 'pointer',
							}}
							onClick={() => handleCardClick(ProjectManagementType.DigitalEngineersManaged)}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'scale(1.02)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
							}}
						>
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<i
										className="mdi mdi-account-supervisor text-primary"
										style={{ fontSize: '48px' }}
									></i>
								</div>
								<h5 className="mb-3">Novobid Managed</h5>
								<p className="text-muted mb-3">
									Our admin team manages the project and specialists
								</p>
								<ul className="list-unstyled text-start">
									<li className="mb-2">
										<i className="mdi mdi-check-circle text-success me-2"></i>
										Requires quote approval before starting
									</li>
									<li className="mb-2">
										<i className="mdi mdi-check-circle text-success me-2"></i>
										Professional project management
									</li>
									<li className="mb-2">
										<i className="mdi mdi-check-circle text-success me-2"></i>
										Best for complex projects
									</li>
								</ul>
							</Card.Body>
						</Card>
					</Col>

					{/* Client Managed Option */}
					<Col md={6}>
						<Card
							className={`h-100 cursor-pointer management-type-card ${
								selectedType === ProjectManagementType.ClientManaged
									? 'border-primary'
									: 'border-light'
							}`}
							style={{
								borderWidth: selectedType === ProjectManagementType.ClientManaged ? '2px' : '1px',
								transition: 'all 0.2s ease',
								cursor: 'pointer',
							}}
							onClick={() => handleCardClick(ProjectManagementType.ClientManaged)}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'scale(1.02)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
							}}
						>
							<Card.Body className="text-center p-4">
								<div className="mb-3">
									<i
										className="mdi mdi-account-circle text-info"
										style={{ fontSize: '48px' }}
									></i>
								</div>
								<h5 className="mb-3">Client Managed (Self-Managed)</h5>
								<p className="text-muted mb-3">
									You manage the project and specialists yourself
								</p>
								<ul className="list-unstyled text-start">
									<li className="mb-2">
										<i className="mdi mdi-check-circle text-success me-2"></i>
										No approval needed - ready instantly!
									</li>
									<li className="mb-2">
										<i className="mdi mdi-check-circle text-success me-2"></i>
										Full control over project
									</li>
									<li className="mb-2">
										<i className="mdi mdi-check-circle text-success me-2"></i>
										Best for experienced clients
									</li>
								</ul>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleHide} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={handleConfirm}
					disabled={!selectedType || isSubmitting}
				>
					{isSubmitting ? (
						<>
							<span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
							Creating...
						</>
					) : (
						'Confirm & Create Project'
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ManagementTypeSelectionModal;
