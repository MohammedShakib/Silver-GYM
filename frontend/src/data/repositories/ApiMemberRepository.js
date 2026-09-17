const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export class ApiMemberRepository {
  static async getMember() {
    const res = await fetch(`${getBaseUrl()}/me`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch member');
    return res.json();
  }

  static async getActivity() {
    const res = await fetch(`${getBaseUrl()}/me/activity`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
  }

  static async getSavedGyms() {
    const res = await fetch(`${getBaseUrl()}/me/saved-gyms`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch saved gyms');
    return res.json();
  }

  static async toggleSavedGym(gymId, isSaved) {
    const method = isSaved ? 'POST' : 'DELETE';
    const res = await fetch(`${getBaseUrl()}/me/saved-gyms/${gymId}`, { method, credentials: 'include' });
    if (!res.ok) throw new Error('Failed to toggle saved gym');
    if (method === 'POST') return res.json();
    return true;
  }
}
