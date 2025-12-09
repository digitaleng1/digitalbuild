/**
 * Firebase Messaging Service
 * ONE CLASS for ALL message types (foreground + background)
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from '@/config/firebase.config';
import type { Notification } from '@/types/notification';
import { NotificationType, NotificationSubType } from '@/types/notification';

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: Record<string, string>;
}

type NotificationCallback = (notification: Notification) => void;

/**
 * Singleton Firebase Messaging Service
 * Handles ALL notification types (foreground + background)
 */
class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;
  
  private app: FirebaseApp | null = null;
  private messaging: Messaging | null = null;
  private isInitialized = false;
  private listeners: Set<NotificationCallback> = new Set();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  /**
   * Initialize Firebase and Messaging
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Check browser support
      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        console.warn('[FCM] Service Worker or Notifications not supported');
        return;
      }

      // Initialize Firebase app
      this.app = initializeApp(firebaseConfig);
      
      // Wait for Service Worker to be ready
      await navigator.serviceWorker.ready;
      
      // Initialize messaging
      this.messaging = getMessaging(this.app);
      
      // Setup foreground message listener
      this.setupForegroundListener();
      
      // Setup Service Worker message listener (for background notifications)
      this.setupServiceWorkerListener();
      
      this.isInitialized = true;
      console.log('[FCM] Initialized successfully');
    } catch (error) {
      console.error('[FCM] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Get FCM token
   */
  public async getToken(): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.messaging) {
        console.warn('[FCM] Messaging not supported');
        return null;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.warn('[FCM] Notification permission denied');
        return null;
      }

      // Get Service Worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Get FCM token
      const token = await getToken(this.messaging, { 
        vapidKey,
        serviceWorkerRegistration: registration
      });
      
      if (token) {
        console.log('[FCM] Token obtained');
        return token;
      } else {
        console.warn('[FCM] No token available');
        return null;
      }
    } catch (error) {
      console.error('[FCM] Error getting token:', error);
      return null;
    }
  }

  /**
   * Subscribe to notifications
   */
  public onNotification(callback: NotificationCallback): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Setup foreground message listener
   */
  private setupForegroundListener(): void {
    if (!this.messaging) {
      return;
    }

    onMessage(this.messaging, (payload: NotificationPayload) => {
      console.log('[FCM] Foreground message received:', payload);
      
      // Convert to Notification and notify listeners
      const notification = this.convertToNotification(payload, 'foreground');
      this.notifyListeners(notification);
      
      // Send to Service Worker to show native notification
      this.sendToServiceWorker(payload);
    });
  }

  /**
   * Setup Service Worker message listener (for background notifications)
   */
  private setupServiceWorkerListener(): void {
    navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_RECEIVED') {
        console.log('[FCM] Background notification received:', event.data.payload);
        
        // Notify React app
        const notification = this.convertFromServiceWorker(event.data.payload);
        this.notifyListeners(notification);
      }
    });
  }

  /**
   * Send foreground notification to Service Worker for native display
   */
  private sendToServiceWorker(payload: NotificationPayload): void {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'FOREGROUND_NOTIFICATION',
        payload
      });
    }
  }

  /**
   * Convert Firebase payload to Notification
   */
  private convertToNotification(payload: NotificationPayload, source: 'foreground' | 'background'): Notification {
    return {
      id: parseInt(payload.data?.notificationId || '0'),
      title: payload.notification?.title || 'New Notification',
      body: payload.notification?.body || '',
      type: (payload.data?.type as NotificationType) || NotificationType.System,
      subType: (payload.data?.subType as NotificationSubType) || NotificationSubType.WelcomeMessage,
      isRead: false,
      isDelivered: true,
      createdAt: new Date().toISOString(),
      readAt: undefined,
      deliveredAt: new Date().toISOString(),
      senderId: payload.data?.senderId || '',
      senderName: payload.data?.senderName || '',
      senderProfilePicture: payload.data?.senderProfilePicture,
      additionalData: payload.data
    };
  }

  /**
   * Convert Service Worker payload to Notification
   */
  private convertFromServiceWorker(payload: any): Notification {
    return {
      id: payload.id || 0,
      title: payload.title || 'New Notification',
      body: payload.body || '',
      type: (payload.type as NotificationType) || NotificationType.System,
      subType: (payload.subType as NotificationSubType) || NotificationSubType.WelcomeMessage,
      isRead: false,
      isDelivered: true,
      createdAt: new Date().toISOString(),
      readAt: undefined,
      deliveredAt: new Date().toISOString(),
      senderId: payload.data?.senderId || '',
      senderName: payload.data?.senderName || '',
      senderProfilePicture: payload.data?.senderProfilePicture,
      additionalData: payload.data
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(notification: Notification): void {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('[FCM] Error in notification callback:', error);
      }
    });
  }
}

export default FirebaseMessagingService;
