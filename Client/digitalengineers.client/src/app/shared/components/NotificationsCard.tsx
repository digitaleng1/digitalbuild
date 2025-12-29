import { useState, useMemo, useCallback } from 'react';
import { Card, CardBody, Badge, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { NotificationList, NotificationItem, NotificationDetailsModal } from '@/components/Notifications';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Notification } from '@/types/notification';

type FilterType = 'all' | 'unread';

const NotificationsCard = () => {
	const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, deleteNotification, refreshNotifications } =
		useNotifications();

	const [filter, setFilter] = useState<FilterType>('all');
	const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
	const [showModal, setShowModal] = useState(false);

	const filteredNotifications = useMemo(() => {
		if (filter === 'unread') {
			return notifications.filter((n) => !n.isRead);
		}
		return notifications;
	}, [notifications, filter]);

	const handleNotificationClick = useCallback(
		async (notification: Notification) => {
			setSelectedNotification(notification);
			setShowModal(true);
			if (!notification.isRead) {
				try {
					await markAsRead(notification.id);
				} catch (err) {
					console.error('Failed to mark as read:', err);
				}
			}
		},
		[markAsRead]
	);

	const handleMarkAsRead = useCallback(
		async (id: number) => {
			try {
				await markAsRead(id);
			} catch (err) {
				console.error('Failed to mark as read:', err);
			}
		},
		[markAsRead]
	);

	const handleDelete = useCallback(
		async (id: number) => {
			try {
				await deleteNotification(id);
			} catch (err) {
				console.error('Failed to delete:', err);
			}
		},
		[deleteNotification]
	);

	const handleMarkAllAsRead = useCallback(async () => {
		try {
			await markAllAsRead();
		} catch (err) {
			console.error('Failed to mark all as read:', err);
		}
	}, [markAllAsRead]);

	const handleCloseModal = useCallback(() => {
		setShowModal(false);
		setSelectedNotification(null);
	}, []);

	return (
		<>
			<Card>
				<CardBody>
					<CardTitle
						containerClass="d-flex align-items-center justify-content-between mb-3"
						title={
							<div className="d-flex align-items-center">
								<i className="mdi mdi-bell-outline me-2"></i>
								<h4 className="header-title mb-0">
									Notifications
									{unreadCount > 0 && (
										<Badge bg="danger" className="ms-2">
											{unreadCount}
										</Badge>
									)}
								</h4>
							</div>
						}
					>
						<div className="d-flex align-items-center gap-2">
							<Button variant="link" size="sm" className="p-0" onClick={refreshNotifications} title="Refresh">
								<i className="mdi mdi-refresh font-18"></i>
							</Button>
						</div>
					</CardTitle>

					{/* Filter & Actions */}
					<div className="d-flex justify-content-between align-items-center mb-3">
						<ButtonGroup size="sm">
							<Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => setFilter('all')}>
								All ({notifications.length})
							</Button>
							<Button
								variant={filter === 'unread' ? 'primary' : 'outline-primary'}
								onClick={() => setFilter('unread')}
							>
								Unread ({unreadCount})
							</Button>
						</ButtonGroup>

						{unreadCount > 0 && (
							<Button variant="outline-success" size="sm" onClick={handleMarkAllAsRead}>
								<i className="mdi mdi-check-all me-1"></i>
								Mark all read
							</Button>
						)}
					</div>

					{/* Content */}
					{loading ? (
						<div className="text-center py-4">
							<Spinner animation="border" size="sm" />
							<p className="mt-2 mb-0 text-muted">Loading notifications...</p>
						</div>
					) : error ? (
						<Alert variant="danger" className="mb-0">
							<i className="mdi mdi-alert-circle-outline me-2"></i>
							{error}
						</Alert>
					) : filteredNotifications.length === 0 ? (
						<div className="text-center py-4">
							<i className="mdi mdi-bell-off-outline text-muted" style={{ fontSize: '48px' }}></i>
							<p className="text-muted mt-2 mb-0">
								{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
							</p>
						</div>
					) : (
						<SimplebarReactClient style={{ maxHeight: '400px' }}>
							<NotificationList>
								{filteredNotifications.map((notification) => (
									<NotificationItem
										key={notification.id}
										notification={notification}
										onMarkAsRead={handleMarkAsRead}
										onDelete={handleDelete}
										onClick={handleNotificationClick}
									/>
								))}
							</NotificationList>
						</SimplebarReactClient>
					)}
				</CardBody>
			</Card>

			<NotificationDetailsModal
				show={showModal}
				onHide={handleCloseModal}
				notification={selectedNotification}
				onMarkAsRead={handleMarkAsRead}
				onDelete={handleDelete}
			/>
		</>
	);
};

export default NotificationsCard;
