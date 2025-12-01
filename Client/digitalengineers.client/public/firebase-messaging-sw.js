/**
 * Firebase Messaging Service Worker
 * Handles BACKGROUND notifications (when app is inactive)
 */

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAmQJlJO2fIJpUi0EOxMsIAaYY3CszqgyA",
  authDomain: "test-notificator.firebaseapp.com",
  projectId: "test-notificator",
  storageBucket: "test-notificator.firebasestorage.app",
  messagingSenderId: "856141206152",
  appId: "1:856141206152:web:188688de2537173fe6053d",
  measurementId: "G-33YG9DBVL3"
};

let messaging = null;

/**
 * Initialize Firebase
 */
function initializeFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      messaging = firebase.messaging();
      console.log('[SW] Firebase initialized');
      
      setupBackgroundMessageHandler();
    }
  } catch (error) {
    console.error('[SW] Failed to initialize Firebase:', error);
  }
}

/**
 * Handle background messages
 */
function setupBackgroundMessageHandler() {
  if (!messaging) {
    console.error('[SW] Messaging not initialized');
    return;
  }

  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Background message received:', payload);
    
    // Show native notification
    showNotification(payload);
    
    // Notify React app
    notifyReactApp(payload);
  });
}

/**
 * Show native browser notification
 */
function showNotification(payload) {
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: '/badge.png',
    data: {
      ...payload.data,
      timestamp: Date.now()
    },
    tag: payload.data?.notificationId || `notification-${Date.now()}`,
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}

/**
 * Send notification to React app
 */
function notifyReactApp(payload) {
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'NOTIFICATION_RECEIVED',
        payload: {
          id: parseInt(payload.data?.notificationId || '0'),
          title: payload.notification?.title || 'New Notification',
          body: payload.notification?.body || '',
          type: payload.data?.type || 'System',
          subType: payload.data?.subType || 'General',
          data: payload.data,
          timestamp: Date.now()
        }
      });
    });
  });
}

/**
 * Handle notification click
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification);

  event.notification.close();

  const actionUrl = event.notification.data?.actionUrl || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          
          // Navigate to action URL
          if (actionUrl !== '/') {
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              payload: { url: actionUrl }
            });
          }
          return;
        }
      }
      
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(actionUrl);
      }
    })
  );
});

/**
 * Handle foreground notifications from React app
 */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FOREGROUND_NOTIFICATION') {
    console.log('[SW] Foreground notification from React:', event.data.payload);
    showNotification(event.data.payload);
  }
});

/**
 * Initialize on activate
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated');
  event.waitUntil(initializeFirebase());
});

/**
 * Initialize on install
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed');
  self.skipWaiting();
  event.waitUntil(initializeFirebase());
});
