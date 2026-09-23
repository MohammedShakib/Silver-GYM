import api from './api';

export const partnerApi = {
  getGyms: async () => {
    const { data } = await api.get('/partner/gyms');
    return data;
  },

  getOverview: async (gymId) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/overview`);
    return data;
  },

  getCheckIns: async (gymId, params = {}) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/check-ins`, { params });
    return data;
  },

  getAnalytics: async (gymId, days = 30) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/analytics?days=${days}`);
    return data;
  },

  getRevenue: async (gymId) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/revenue`);
    return data;
  },

  getProfile: async (gymId) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/profile`);
    return data;
  },

  updateProfile: async (gymId, profileData) => {
    const { data } = await api.patch(`/partner/gyms/${gymId}/profile`, profileData);
    return data;
  },

  updateCrowdOverride: async (gymId, level, hours = 2) => {
    const { data } = await api.post(`/partner/gyms/${gymId}/crowd-override`, { level, hours });
    return data;
  },

  getTrainers: async (gymId) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/trainers`);
    return data;
  },

  addTrainer: async (gymId, trainerData) => {
    const { data } = await api.post(`/partner/gyms/${gymId}/trainers`, trainerData);
    return data;
  },

  deleteTrainer: async (gymId, trainerId) => {
    await api.delete(`/partner/gyms/${gymId}/trainers/${trainerId}`);
  },

  getReviews: async (gymId, params = {}) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/reviews`, { params });
    return data;
  },

  respondToReview: async (gymId, reviewId, response) => {
    const { data } = await api.post(`/partner/gyms/${gymId}/reviews/${reviewId}/respond`, { response });
    return data;
  },

  getStaff: async (gymId) => {
    const { data } = await api.get(`/partner/gyms/${gymId}/staff`);
    return data;
  },

  inviteStaff: async (gymId, email, role) => {
    const { data } = await api.post(`/partner/gyms/${gymId}/staff/invite`, { email, role });
    return data;
  },

  removeStaff: async (gymId, staffId) => {
    await api.delete(`/partner/gyms/${gymId}/staff/${staffId}`);
  }
};
