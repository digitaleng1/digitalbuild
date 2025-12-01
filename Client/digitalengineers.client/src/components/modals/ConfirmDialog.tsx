import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

interface ConfirmDialogProps {
	show: boolean;
	onHide: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	confirmVariant?: 'primary' | 'success' | 'danger' | 'warning';
	cancelText?: string;
	loading?: boolean;
	icon?: string;
	alertVariant?: 'warning' | 'info' | 'danger' | 'success';
	alertMessage?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	show,
	onHide,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	confirmVariant = 'primary',
	cancelText = 'Cancel',
	loading = false,
	icon,
	alertVariant,
	alertMessage,
}) => {
	return (
		<Modal show={show} onHide={!loading ? onHide : undefined} centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>
					{icon && <i className={`${icon} me-2`}></i>}
					{title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className="mb-3">{message}</p>
				{alertMessage && alertVariant && (
					<Alert variant={alertVariant} className="mb-0">
						<i className="mdi mdi-information-outline me-2"></i>
						{alertMessage}
					</Alert>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide} disabled={loading}>
					{cancelText}
				</Button>
				<Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
					{loading ? (
						<>
							<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
							Processing...
						</>
					) : (
						confirmText
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmDialog;
