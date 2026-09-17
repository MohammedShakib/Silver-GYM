const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export class ApiGymRepository {
  static async getGyms(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${getBaseUrl()}/gyms?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch gyms');
    return res.json();
  }

  static async getGymById(id) {
    const res = await fetch(`${getBaseUrl()}/gyms/${id}`);
    if (!res.ok) throw new Error('Failed to fetch gym');
    return res.json();
  }
}
