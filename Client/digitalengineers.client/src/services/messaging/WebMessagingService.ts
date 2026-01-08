/**
 * SignalR Notification Service
 * Handles real-time notifications via SignalR
 */

import * as signalR from '@microsoft/signalr';
import type { Notification as AppNotification } from '@/types/notification';

type NotificationCallback = (notification: AppNotification) => void;

/**
 * Singleton SignalR Notification Service
 */
class WebMessagingService {
  private static instance: WebMessagingService;
  
  private connection: signalR.HubConnection | null = null;
  private isInitialized = false;
  private listeners: Set<NotificationCallback> = new Set();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): WebMessagingService {
    if (!WebMessagingService.instance) {
      WebMessagingService.instance = new WebMessagingService();
    }
    return WebMessagingService.instance;
  }

  /**
   * Initialize SignalR connection
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized && this.connection) {
      return;
    }

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.warn('[SignalR] No access token available');
        return;
      }

      console.log('[SignalR] Connecting to:', `${baseUrl}/hubs/notifications`);
      
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/notifications`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setupEventHandlers();
      
      await this.connection.start();
      this.isInitialized = true;
      console.log('[SignalR] Connected successfully');
    } catch (error) {
      console.error('[SignalR] Connection error:', error);
      throw error;
    }
  }

  /**
   * Get token - kept for compatibility, returns null for SignalR
   */
  public async getToken(): Promise<string | null> {
    return null;
  }

  /**
   * Subscribe to notifications
   */
  public onNotification(callback: NotificationCallback): () => void {
    this.listeners.add(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Setup SignalR event handlers
   */
  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('ReceiveNotification', (notification: AppNotification) => {
      console.log('[SignalR] Notification received:', notification);
      this.notifyListeners(notification);
      this.showBrowserNotification(notification);
    });

    this.connection.onreconnecting((error) => {
      console.log('[SignalR] Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('[SignalR] Reconnected. Connection ID:', connectionId);
    });

    this.connection.onclose((error) => {
      console.log('[SignalR] Connection closed', error);
      this.isInitialized = false;
    });
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: AppNotification): void {
    if (!('Notification' in window)) return;
    
    if (window.Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        tag: `notification-${notification.id}`,
      });
    } else if (window.Notification.permission !== 'denied') {
      window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new window.Notification(notification.title, {
            body: notification.body,
            icon: '/favicon.ico',
            tag: `notification-${notification.id}`,
          });
        }
      });
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(notification: AppNotification): void {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('[SignalR] Error in notification callback:', error);
      }
    });
  }

  /**
   * Disconnect from SignalR
   */
  public async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('[SignalR] Disconnected');
      } catch (error) {
        console.error('[SignalR] Error disconnecting:', error);
      } finally {
        this.isInitialized = false;
        this.connection = null;
      }
    }
  }
}

export default WebMessagingService;
