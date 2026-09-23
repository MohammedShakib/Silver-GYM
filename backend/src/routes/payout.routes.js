import express from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { payoutController } from '../controllers/payout.controller.js';

const router = express.Router();

// Admin Routes (mounted at /api/v1/admin/payouts)
router.get('/', requireAuth, requireRole('ADMIN'), payoutController.adminGetPayouts);
router.post('/settlements/:settlementId/initiate', requireAuth, requireRole('ADMIN'), payoutController.adminInitiatePayout);
router.post('/:id/confirm', requireAuth, requireRole('ADMIN'), payoutController.adminConfirmManualPayout);

export default router;
