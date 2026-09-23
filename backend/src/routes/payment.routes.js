import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Used by frontend to initiate checkout
router.post('/checkout/membership', requireAuth, paymentController.createCheckoutSession);

// Used by frontend to verify payment status
router.get('/:paymentId', requireAuth, paymentController.verifyPayment);

// Used by provider for webhook (no auth, provider verifies signature)
router.post('/webhooks/:provider', paymentController.handleWebhook);

export default router;
