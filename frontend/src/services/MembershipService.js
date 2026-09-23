import { getApiHealth } from './api';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1');

class MembershipService {
  async getPlans() {
    const res = await fetch(`${API_URL}/plans`);
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  }

  async getCurrentMembership() {
    const res = await fetch(`${API_URL}/me/membership`, {credentials: 'include'});
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch membership');
    }
    return res.json();
  }
  
  async getInvoices() {
    const res = await fetch(`${API_URL}/me/membership/invoices`, {credentials: 'include'});
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  }

  async pauseMembership() {
    const res = await fetch(`${API_URL}/me/membership/pause`, { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Failed to pause membership');
    return res.json();
  }

  async cancelMembership() {
    const res = await fetch(`${API_URL}/me/membership/cancel`, { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Failed to cancel membership');
    return res.json();
  }
}

export const membershipService = new MembershipService();
