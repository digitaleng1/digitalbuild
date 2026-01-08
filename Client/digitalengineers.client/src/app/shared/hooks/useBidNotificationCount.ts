import { useMemo } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationType } from '@/types/notification';

export const useBidNotificationCount = (): number => {
  const { notifications } = useNotifications();
  
  return useMemo(() => {
    return notifications.filter(
      n => !n.isRead && n.type === NotificationType.Bid
    ).length;
  }, [notifications]);
};
