import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Notification } from '@/types/notification';
import { notificationService } from '@/services/notificationService';
import WebMessagingService from '@/services/messaging/WebMessagingService';

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

  // Initialize SignalR Notification Service
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.log('[SignalR] No token available');
          return;
        }

        const messagingService = WebMessagingService.getInstance();
        
        await messagingService.initialize();
        
        const unsubscribe = messagingService.onNotification(handleNewNotification);
        
        console.log('[SignalR] Initialized successfully');
        
        return unsubscribe;
      } catch (err: any) {
        if (err?.response?.status === 401 || err === 'Invalid credentials') {
          console.log('[SignalR] User not authenticated');
          return;
        }
        console.error('[SignalR] Error initializing:', err);
      }
    };

    const unsubscribePromise = initializeSignalR();

    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, [handleNewNotification]);

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
