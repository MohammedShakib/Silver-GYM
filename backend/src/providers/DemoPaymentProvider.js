import PaymentProvider from './PaymentProvider.js';

class DemoPaymentProvider extends PaymentProvider {
  /**
   * Returns a fake checkout URL which redirects to the frontend's sandbox checkout page.
   */
  async createPayment(params) {
    const { paymentId, amount, currency } = params;
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Send them to our own frontend fake checkout page that acts like the provider
    const checkoutUrl = `${frontendUrl}/sandbox/checkout?paymentId=${paymentId}&amount=${amount}&currency=${currency}`;
    
    // Simulate a provider session ID
    const providerSessionId = `demo_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    return {
      checkoutUrl,
      providerSessionId,
      expiresAt
    };
  }

  async verifyPayment(providerTransactionId) {
    // In a real provider, we'd make an HTTP call to the provider API.
    // For demo, we just trust the transaction ID if it starts with 'demo_txn_'.
    if (providerTransactionId && providerTransactionId.startsWith('demo_txn_')) {
      return {
        status: 'PAID', // or whatever we encode in the txn id
        amount: 0, // In demo, we might not encode amount in txn id, but normally we'd return real amount
        currency: 'BDT'
      };
    }
    throw new Error('Invalid provider transaction ID');
  }

  async handleWebhook(req) {
    // Real provider would require signature verification:
    // const signature = req.headers['x-demo-signature'];
    
    const body = req.body;
    
    // Mock parsing
    if (!body || !body.paymentId || !body.providerTransactionId) {
      return { isValid: false };
    }

    return {
      isValid: true,
      providerTransactionId: body.providerTransactionId,
      paymentId: body.paymentId,
      status: body.status === 'SUCCESS' ? 'PAID' : 'FAILED',
      amount: body.amount,
      currency: body.currency || 'BDT',
      rawEvent: body
    };
  }
}

export default DemoPaymentProvider;
