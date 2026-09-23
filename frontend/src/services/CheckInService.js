import api from './api';
import { v4 as uuidv4 } from 'uuid'; // Actually wait, UUID might not be installed. Let's use crypto.randomUUID or a simple fallback if not available.
// Vite / modern browsers support crypto.randomUUID()

class CheckInService {
  /**
   * Scan gym QR code as a member
   */
  async checkInGymQr(token) {
    const idempotencyKey = crypto.randomUUID();
    const response = await api.post('/check-ins', {
      token,
      idempotencyKey
    });
    return response.data;
  }

  /**
   * Scan member pass as a partner receptionist
   */
  async verifyMemberPass(gymId, token) {
    const idempotencyKey = crypto.randomUUID();
    const response = await api.post(`/partner/gyms/${gymId}/check-ins/member-pass`, {
      token,
      idempotencyKey
    });
    return response.data;
  }
}

export const checkInService = new CheckInService();
