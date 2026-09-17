const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export class ApiCheckInRepository {
  static async createCheckIn(gymId, method = 'DEMO') {
    const res = await fetch(`${getBaseUrl()}/check-ins`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gymId, method })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || 'Check-in failed');
    }
    
    return res.json();
  }
}
