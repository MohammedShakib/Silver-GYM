import * as paymentService from '../services/payment.service.js';

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { planId } = req.body;
    // member.id is available if authenticated
    const memberId = req.member ? req.member.id : req.body.memberId;
    
    if (!memberId || !planId) {
      return res.status(400).json({ error: 'Missing memberId or planId' });
    }

    const session = await paymentService.createCheckoutSession(memberId, planId);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const providerName = req.params.provider;
    // Respond quickly to provider
    const result = await paymentService.handleWebhook(providerName, req);
    res.status(200).json({ received: true, status: result.status });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.verifyPayment(paymentId);
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};
