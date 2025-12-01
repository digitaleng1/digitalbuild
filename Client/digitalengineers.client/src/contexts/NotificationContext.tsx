import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Notification } from '@/types/notification';
import { notificationService } from '@/services/notificationService';
import FirebaseMessagingService from '@/services/firebase/FirebaseMessagingService';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = React.memo(({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await notificationService.getNotifications(0, 50);
      setNotifications(data);
      
      const unread = data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err: any) {
      // Ignore 401 errors - user will be redirected by interceptor
      if (err?.response?.status === 401 || err === 'Invalid credentials') {
        console.log('[Notifications] User not authenticated');
        return;
      }
      
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
      console.error('[Notifications] Error loading:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[Notifications] Error marking as read:', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('[Notifications] Error marking all as read:', err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id);
        const unread = updated.filter(n => !n.isRead).length;
        setUnreadCount(unread);
        return updated;
      });
    } catch (err) {
      console.error('[Notifications] Error deleting:', err);
      throw err;
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const handleNewNotification = useCallback((notification: Notification) => {
    console.log('[React] New notification:', notification);
    
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const handleNotificationClick = useCallback((url: string) => {
    if (url && url !== '/') {
      window.location.href = url;
    }
  }, []);

  // Initialize Firebase Messaging Service
  useEffect(() => {
    const initializeFCM = async () => {
      try {
        const fcmService = FirebaseMessagingService.getInstance();
        
        await fcmService.initialize();
        
        const token = await fcmService.getToken();
        
        if (token) {
          const deviceInfo = {
            deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Web',
            deviceName: navigator.userAgent,
          };

          await notificationService.saveFcmToken(token, deviceInfo);
          console.log('[FCM] Token registered successfully');
        }
        
        const unsubscribe = fcmService.onNotification(handleNewNotification);
        
        return unsubscribe;
      } catch (err: any) {
        // Ignore 401 errors during FCM initialization
        if (err?.response?.status === 401 || err === 'Invalid credentials') {
          console.log('[FCM] User not authenticated');
          return;
        }
        console.error('[FCM] Error initializing:', err);
      }
    };

    const unsubscribePromise = initializeFCM();

    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, [handleNewNotification]);

  // Handle notification clicks from Service Worker
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICKED') {
        console.log('[React] Notification clicked:', event.data.payload);
        handleNotificationClick(event.data.payload?.url);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [handleNotificationClick]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const value = useMemo<NotificationContextValue>(() => ({
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  }), [
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
});

NotificationProvider.displayName = 'NotificationProvider';
