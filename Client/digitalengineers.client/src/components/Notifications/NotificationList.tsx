import React from 'react';
import classNames from 'classnames';

interface NotificationListProps {
	className?: string;
	children: React.ReactNode;
}

const NotificationList = ({ className, children }: NotificationListProps) => {
	return <div className={classNames('inbox-widget', className)}>{children}</div>;
};

export default NotificationList;
