const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1');

class CheckoutService {
  async createCheckoutSession(planId) {
    const res = await fetch(`${API_URL}/payments/checkout/membership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
      credentials: 'include'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }
    
    return res.json();
  }

  async verifyPayment(paymentId) {
    const res = await fetch(`${API_URL}/payments/${paymentId}`, {
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error('Failed to verify payment');
    }
    
    return res.json();
  }
}

export const checkoutService = new CheckoutService();
