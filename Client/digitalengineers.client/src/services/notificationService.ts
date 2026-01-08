import HttpClient from '@/common/helpers/httpClient';

export const notificationService = {
  getNotifications: async (skip = 0, take = 20) => {
    return HttpClient.get(`/api/notifications?skip=${skip}&take=${take}`);
  },

  getUnreadCount: async () => {
    return HttpClient.get('/api/notifications/unread-count');
  },

  markAsRead: async (id: number) => {
    return HttpClient.put(`/api/notifications/${id}/mark-read`, {});
  },

  markAllAsRead: async () => {
    return HttpClient.patch('/api/notifications/read-all', {});
  },

  markAsDelivered: async (id: number) => {
    return HttpClient.put(`/api/notifications/${id}/mark-delivered`, {});
  },

  deleteNotification: async (id: number) => {
    return HttpClient.delete(`/api/notifications/${id}`);
  },

  sendTestNotification: async () => {
    return HttpClient.post('/api/notifications/test-send', {});
  },
};
