const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export class ApiMembershipRepository {
  static async getCurrentMembership() {
    const res = await fetch(`${getBaseUrl()}/me/membership`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch membership');
    return res.json();
  }

  static async getPlans() {
    const res = await fetch(`${getBaseUrl()}/plans`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  }
}
