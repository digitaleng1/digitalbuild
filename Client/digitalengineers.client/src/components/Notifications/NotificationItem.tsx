import React from 'react';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import type { Notification } from '@/types/notification';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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

interface NotificationItemProps {
	notification: Notification;
	onMarkAsRead: (id: number) => void;
	onDelete: (id: number) => void;
	onClick: (notification: Notification) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick }: NotificationItemProps) => {
	const { icon, variant } = getNotificationStyle(notification.type);
	const timeAgo = dayjs(notification.createdAt).fromNow();

	const handleMarkAsRead = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!notification.isRead) {
			onMarkAsRead(notification.id);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete(notification.id);
	};

	return (
		<div
			className={classNames('inbox-item', 'cursor-pointer', {
				'border-start border-3 border-primary': !notification.isRead,
			})}
			onClick={() => onClick(notification)}
			style={{ 
				backgroundColor: notification.isRead ? 'transparent' : 'rgba(var(--bs-primary-rgb), 0.05)',
				transition: 'background-color 0.2s'
			}}
		>
			<div className="inbox-item-img">
				{notification.senderProfilePicture ? (
					<img
						src={notification.senderProfilePicture}
						height={40}
						width={40}
						className="rounded-circle"
						alt={notification.senderName}
					/>
				) : (
					<div
						className={classNames('rounded-circle d-flex align-items-center justify-content-center', `bg-${variant}`)}
						style={{ width: 40, height: 40 }}
					>
						<i className={classNames(icon, 'text-white')} style={{ fontSize: '1.2rem' }}></i>
					</div>
				)}
			</div>
			<p className={classNames('inbox-item-author', { 'fw-bold': !notification.isRead })}>
				{notification.title}
			</p>
			<p className="inbox-item-text text-truncate">{notification.body}</p>
			<p className="inbox-item-date d-flex align-items-center gap-1">
				<small className="text-muted">{timeAgo}</small>
				{!notification.isRead && (
					<Button
						variant="link"
						size="sm"
						className="p-0 text-success"
						onClick={handleMarkAsRead}
						title="Mark as read"
					>
						<i className="mdi mdi-check"></i>
					</Button>
				)}
				<Button
					variant="link"
					size="sm"
					className="p-0 text-danger"
					onClick={handleDelete}
					title="Delete"
				>
					<i className="mdi mdi-close"></i>
				</Button>
			</p>
		</div>
	);
};

export default NotificationItem;
