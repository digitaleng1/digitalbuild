import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface SendMessageModalProps {
	show: boolean;
	onHide: () => void;
	onConfirm: (message: string) => Promise<void>;
	recipientName: string;
	loading?: boolean;
}

const SendMessageModal = ({ 
	show, 
	onHide, 
	onConfirm, 
	recipientName,
	loading = false 
}: SendMessageModalProps) => {
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!message.trim()) {
			setError('Please enter a message');
			return;
		}

		try {
			await onConfirm(message.trim());
			setMessage('');
			setError('');
			onHide();
		} catch (err) {
			setError('Failed to send message. Please try again.');
		}
	};

	const handleClose = () => {
		setMessage('');
		setError('');
		onHide();
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Send Message to {recipientName}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					{error && (
						<Alert variant="danger" dismissible onClose={() => setError('')}>
							{error}
						</Alert>
					)}
					<Form.Group>
						<Form.Label>Message</Form.Label>
						<Form.Control
							as="textarea"
							rows={4}
							placeholder="Enter your message..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							disabled={loading}
							required
						/>
						<Form.Text className="text-muted">
							This message will be sent to the specialist regarding their bid response.
						</Form.Text>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="light" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" disabled={loading}>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
								Sending...
							</>
						) : (
							<>
								<i className="mdi mdi-send me-1"></i>
								Send Message
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default SendMessageModal;
