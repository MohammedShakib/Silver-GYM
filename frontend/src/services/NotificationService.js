import api from './api';

export const NotificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.notification;
  },

  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data.success;
  },

  getPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.data.preferences;
  },

  updatePreferences: async (data) => {
    const response = await api.patch('/notifications/preferences', data);
    return response.data.preferences;
  }
};
