import { Modal, Button, Badge } from 'react-bootstrap';
import type { Notification } from '@/types/notification';
import dayjs from 'dayjs';

const getNotificationStyle = (type: string) => {
	const styles: Record<string, { icon: string; variant: string }> = {
		Task: { icon: 'mdi mdi-clipboard-check', variant: 'primary' },
		Project: { icon: 'mdi mdi-folder', variant: 'info' },
		Bid: { icon: 'mdi mdi-gavel', variant: 'warning' },
		Quote: { icon: 'mdi mdi-currency-usd', variant: 'success' },
		System: { icon: 'mdi mdi-bell', variant: 'secondary' },
	};
	return styles[type] || { icon: 'mdi mdi-bell', variant: 'secondary' };
};

interface NotificationDetailsModalProps {
	show: boolean;
	onHide: () => void;
	notification: Notification | null;
	onMarkAsRead: (id: number) => void;
	onDelete: (id: number) => void;
}

const NotificationDetailsModal = ({
	show,
	onHide,
	notification,
	onMarkAsRead,
	onDelete,
}: NotificationDetailsModalProps) => {
	if (!notification) return null;

	const { icon, variant } = getNotificationStyle(notification.type);

	const handleMarkAsRead = () => {
		if (!notification.isRead) {
			onMarkAsRead(notification.id);
		}
	};

	const handleDelete = () => {
		onDelete(notification.id);
		onHide();
	};

	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>Notification Details</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/* Sender Info */}
				<div className="d-flex align-items-center mb-3">
					{notification.senderProfilePicture ? (
						<img
							src={notification.senderProfilePicture}
							height={48}
							width={48}
							className="rounded-circle me-3"
							alt={notification.senderName}
						/>
					) : (
						<div
							className={`rounded-circle d-flex align-items-center justify-content-center bg-${variant} me-3`}
							style={{ width: 48, height: 48 }}
						>
							<i className={`${icon} text-white`} style={{ fontSize: '1.5rem' }}></i>
						</div>
					)}
					<div>
						<h6 className="mb-0">{notification.senderName || 'System'}</h6>
						<small className="text-muted">{dayjs(notification.createdAt).format('MMM DD, YYYY h:mm A')}</small>
					</div>
				</div>

				{/* Type Badges */}
				<div className="mb-3">
					<Badge bg={variant} className="me-2">
						{notification.type}
					</Badge>
					<Badge bg="secondary">{notification.subType}</Badge>
					{!notification.isRead && (
						<Badge bg="danger" className="ms-2">
							Unread
						</Badge>
					)}
				</div>

				<hr />

				{/* Title & Body */}
				<h5 className="mb-2">{notification.title}</h5>
				<p className="text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>
					{notification.body}
				</p>

				<hr />

				{/* Timestamps */}
				<div className="small text-muted">
					<div className="mb-1">
						<i className="mdi mdi-clock-outline me-1"></i>
						<strong>Created:</strong> {dayjs(notification.createdAt).format('MMM DD, YYYY h:mm A')}
					</div>
					{notification.deliveredAt && (
						<div className="mb-1">
							<i className="mdi mdi-check me-1"></i>
							<strong>Delivered:</strong> {dayjs(notification.deliveredAt).format('MMM DD, YYYY h:mm A')}
						</div>
					)}
					<div className="mb-1">
						<i className="mdi mdi-eye me-1"></i>
						<strong>Read:</strong>{' '}
						{notification.readAt ? dayjs(notification.readAt).format('MMM DD, YYYY h:mm A') : 'Not yet'}
					</div>
				</div>

				{/* Additional Data */}
				{notification.additionalData && Object.keys(notification.additionalData).length > 0 && (
					<>
						<hr />
						<h6>Additional Information</h6>
						<ul className="list-unstyled small text-muted mb-0">
							{Object.entries(notification.additionalData).map(([key, value]) => (
								<li key={key}>
									<strong>{key}:</strong> {value}
								</li>
							))}
						</ul>
					</>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={handleDelete}>
					<i className="mdi mdi-delete me-1"></i>
					Delete
				</Button>
				{!notification.isRead && (
					<Button variant="success" onClick={handleMarkAsRead}>
						<i className="mdi mdi-check me-1"></i>
						Mark as Read
					</Button>
				)}
				<Button variant="secondary" onClick={onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default NotificationDetailsModal;
