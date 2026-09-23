/**
 * PaymentProvider interface.
 * Any actual payment provider (bKash, Nagad, Stripe, etc.) should implement these methods.
 */
class PaymentProvider {
  /**
   * Initialize a payment session/checkout URL
   * @param {Object} params
   * @param {string} params.paymentId - Local database payment ID
   * @param {number} params.amount - Payment amount in minimum units (e.g., paisa)
   * @param {string} params.currency - Currency code (e.g., 'BDT')
   * @param {string} params.description - Item description
   * @param {string} params.customerEmail - Customer email
   * @param {string} params.customerPhone - Customer phone
   * @returns {Promise<{checkoutUrl: string, providerSessionId: string, expiresAt: Date}>}
   */
  async createPayment(params) {
    throw new Error('Not implemented');
  }

  /**
   * Verify a payment directly with the provider
   * @param {string} providerTransactionId
   * @returns {Promise<{status: string, amount: number, currency: string}>}
   */
  async verifyPayment(providerTransactionId) {
    throw new Error('Not implemented');
  }

  /**
   * Handle incoming webhook
   * @param {Object} req - Express request object
   * @returns {Promise<{
   *   isValid: boolean, 
   *   providerTransactionId: string, 
   *   paymentId: string, 
   *   status: string, 
   *   amount: number, 
   *   currency: string,
   *   rawEvent: Object
   * }>}
   */
  async handleWebhook(req) {
    throw new Error('Not implemented');
  }
}

export default PaymentProvider;
