import api from './api';

export const adminApi = {
  // Overview
  getOverview: async () => {
    const response = await api.get('/admin/overview');
    return response.data;
  },

  // Members
  getMembers: async (params) => {
    const response = await api.get('/admin/members', { params });
    return response.data;
  },
  getMemberDetail: async (id) => {
    const response = await api.get(`/admin/members/${id}`);
    return response.data;
  },
  suspendMember: async (id, reason) => {
    const response = await api.post(`/admin/members/${id}/suspend`, { reason });
    return response.data;
  },
  reactivateMember: async (id) => {
    const response = await api.post(`/admin/members/${id}/reactivate`);
    return response.data;
  },

  // Gyms
  getGyms: async (params) => {
    const response = await api.get('/admin/gyms', { params });
    return response.data;
  },
  getGymDetail: async (id) => {
    const response = await api.get(`/admin/gyms/${id}`);
    return response.data;
  },
  updateGymStatus: async (id, status, reason) => {
    const response = await api.post(`/admin/gyms/${id}/status`, { status, reason });
    return response.data;
  },
  updateGymAccessTier: async (id, accessTier) => {
    const response = await api.post(`/admin/gyms/${id}/access-tier`, { accessTier });
    return response.data;
  },
  updateGymVerification: async (id, verified) => {
    const response = await api.post(`/admin/gyms/${id}/verification`, { verified });
    return response.data;
  },

  // Applications
  getApplications: async (params) => {
    const response = await api.get('/admin/applications', { params });
    return response.data;
  },
  approveApplication: async (id) => {
    const response = await api.post(`/admin/applications/${id}/approve`);
    return response.data;
  },
  rejectApplication: async (id, reason) => {
    const response = await api.post(`/admin/applications/${id}/reject`, { reason });
    return response.data;
  },

  // Memberships & Plans
  getMemberships: async (params) => {
    const response = await api.get('/admin/memberships', { params });
    return response.data;
  },
  getPlans: async () => {
    const response = await api.get('/admin/plans');
    return response.data;
  },
  updatePlan: async (id, data) => {
    const response = await api.put(`/admin/plans/${id}`, data);
    return response.data;
  },

  // Payments & Invoices
  getPayments: async (params) => {
    const response = await api.get('/admin/payments', { params });
    return response.data;
  },
  getInvoices: async (params) => {
    const response = await api.get('/admin/invoices', { params });
    return response.data;
  },

  // Check-Ins
  getCheckIns: async (params) => {
    const response = await api.get('/admin/check-ins', { params });
    return response.data;
  },

  // Support
  getSupportCases: async (params) => {
    const response = await api.get('/admin/support', { params });
    return response.data;
  },
  updateSupportCaseStatus: async (id, status) => {
    const response = await api.put(`/admin/support/${id}/status`, { status });
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async (params) => {
    const response = await api.get('/admin/audit', { params });
    return response.data;
  }
};
