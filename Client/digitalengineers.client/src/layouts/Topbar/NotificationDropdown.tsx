import React, { useMemo, useCallback, useState } from 'react';
import { Card, Col, Dropdown, Row, Spinner, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { useToggle } from '@/hooks';
import { Link } from "react-router";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
import { useNotifications } from '@/contexts/NotificationContext';
import type { Notification } from '@/types/notification';
import { notificationService } from '@/services/notificationService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// notifiaction continer styles
const notificationShowContainerStyle = {
	maxHeight: '300px',
};

// Map notification type to icon and variant
const getNotificationStyle = (type: string) => {
	const styles: Record<string, { icon: string; variant: string }> = {
		'Task': { icon: 'mdi mdi-clipboard-check', variant: 'primary' },
		'Project': { icon: 'mdi mdi-folder', variant: 'info' },
		'Bid': { icon: 'mdi mdi-gavel', variant: 'warning' },
		'Quote': { icon: 'mdi mdi-currency-usd', variant: 'success' },
		'System': { icon: 'mdi mdi-bell', variant: 'secondary' },
	};
	return styles[type] || { icon: 'mdi mdi-bell', variant: 'secondary' };
};

// Group notifications by day
const groupNotificationsByDay = (notifications: Notification[]) => {
	const grouped = notifications.reduce((acc, notification) => {
		const date = dayjs(notification.createdAt);
		const today = dayjs();
		const yesterday = dayjs().subtract(1, 'day');

		let day: string;
		if (date.isSame(today, 'day')) {
			day = 'Today';
		} else if (date.isSame(yesterday, 'day')) {
			day = 'Yesterday';
		} else {
			day = date.format('MMM DD, YYYY');
		}

		if (!acc[day]) {
			acc[day] = [];
		}
		acc[day].push(notification);
		return acc;
	}, {} as Record<string, Notification[]>);

	return grouped;
};

const NotificationDropdown = React.memo(() => {
	const [isOpen, toggleDropdown] = useToggle();
	const [isSendingTest, setIsSendingTest] = useState(false);
	const { 
		notifications, 
		unreadCount, 
		loading, 
		markAsRead, 
		markAllAsRead, 
		deleteNotification 
	} = useNotifications();

	// Group notifications by day
	const groupedNotifications = useMemo(() => 
		groupNotificationsByDay(notifications),
		[notifications]
	);

	// Handle mark as read
	const handleMarkAsRead = useCallback(async (id: number, isRead: boolean) => {
		if (!isRead) {
			try {
				await markAsRead(id);
			} catch (error) {
				console.error('Failed to mark as read:', error);
			}
		}
	}, [markAsRead]);

	// Handle delete notification
	const handleDelete = useCallback(async (e: React.MouseEvent, id: number) => {
		e.stopPropagation();
		try {
			await deleteNotification(id);
		} catch (error) {
			console.error('Failed to delete notification:', error);
		}
	}, [deleteNotification]);

	// Handle mark all as read
	const handleMarkAllAsRead = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await markAllAsRead();
		} catch (error) {
			console.error('Failed to mark all as read:', error);
		}
	}, [markAllAsRead]);

	// Handle send test notification
	const handleSendTest = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsSendingTest(true);
		try {
			await notificationService.sendTestNotification();
		} catch (error) {
			console.error('Failed to send test notification:', error);
		} finally {
			setIsSendingTest(false);
		}
	}, []);

	return (
		<Dropdown show={isOpen} onToggle={toggleDropdown}>
			<Dropdown.Toggle variant="link" id="dropdown-notification" onClick={toggleDropdown} className="nav-link dropdown-toggle arrow-none">
				<i className="ri-notification-3-line font-22"></i>
				{unreadCount > 0 && (
					<span className="noti-icon-badge">{unreadCount}</span>
				)}
			</Dropdown.Toggle>
			<Dropdown.Menu className="dropdown-menu-animated dropdown-lg" align="end">
				<div onClick={toggleDropdown}>
					<div className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
						<Row className="align-items-center">
							<Col>
								<h6 className="m-0 font-16 fw-semibold">
									Notifications
									{unreadCount > 0 && (
										<span className="badge bg-danger ms-2">{unreadCount}</span>
									)}
								</h6>
							</Col>
							<Col xs="auto" className="d-flex gap-1">
								<Button 
									size="sm" 
									variant="outline-primary" 
									onClick={handleSendTest}
									disabled={isSendingTest}
								>
									{isSendingTest ? (
										<>
											<Spinner size="sm" animation="border" className="me-1" />
											Test
										</>
									) : (
										<>
											<i className="mdi mdi-send me-1"></i>
											Test
										</>
									)}
								</Button>
								{notifications.length > 0 && (
									<Link 
										to="" 
										onClick={handleMarkAllAsRead}
										className="text-dark text-decoration-underline"
									>
										<small>Clear All</small>
									</Link>
								)}
							</Col>
						</Row>
					</div>
					<SimplebarReactClient className="p-2" style={notificationShowContainerStyle}>
						{loading ? (
							<div className="text-center py-3">
								<Spinner animation="border" size="sm" />
								<p className="mt-2 mb-0">Loading notifications...</p>
							</div>
						) : notifications.length === 0 ? (
							<div className="text-center py-3">
								<i className="mdi mdi-bell-off-outline text-muted" style={{ fontSize: '48px' }}></i>
								<p className="text-muted mt-2 mb-0">No notifications</p>
							</div>
						) : (
							Object.entries(groupedNotifications).map(([day, dayNotifications]) => (
								<React.Fragment key={day}>
									<h5 className="text-muted font-12 text-uppercase mt-0">{day}</h5>
									{dayNotifications.map((notification) => {
										const { icon, variant } = getNotificationStyle(notification.type);
										const timeAgo = dayjs(notification.createdAt).fromNow();

										return (
											<Dropdown.Item
												key={notification.id}
												onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
												className={classNames(
													'p-0 notify-item card shadow-none mb-2',
													notification.isRead ? 'read-noti' : 'unread-noti'
												)}
											>
												<Card.Body>
													<span 
														className="float-end noti-close-btn text-muted"
														onClick={(e) => handleDelete(e, notification.id)}
													>
														<i className="mdi mdi-close"></i>
													</span>
													<div className="d-flex align-items-center">
														<div className="flex-shrink-0">
															<div className={classNames('notify-icon', `bg-${variant}`)}>
																{notification.senderProfilePicture ? (
																	<img 
																		src={notification.senderProfilePicture} 
																		className="img-fluid rounded-circle" 
																		alt={notification.senderName} 
																	/>
																) : (
																	<i className={icon}></i>
																)}
															</div>
														</div>
														<div className="flex-grow-1 text-truncate ms-2">
															<h5 className="noti-item-title fw-semibold font-14">
																{notification.title}
																<small className="fw-normal text-muted ms-1">{timeAgo}</small>
															</h5>
															<small className="noti-item-subtitle text-muted">
																{notification.body}
															</small>
														</div>
													</div>
												</Card.Body>
											</Dropdown.Item>
										);
									})}
								</React.Fragment>
							))
						)}
					</SimplebarReactClient>

					{notifications.length > 0 && (
						<Dropdown.Item className="text-center text-primary notify-item border-top border-light py-2">
							View All
						</Dropdown.Item>
					)}
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
});

NotificationDropdown.displayName = 'NotificationDropdown';

export default NotificationDropdown;
