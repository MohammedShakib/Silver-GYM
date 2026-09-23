import express from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { settlementController } from '../controllers/settlement.controller.js';

const router = express.Router();

// Admin Routes (mounted at /api/v1/admin/settlements)
router.get('/', requireAuth, requireRole('ADMIN'), settlementController.adminGetSettlements);
router.post('/generate', requireAuth, requireRole('ADMIN'), settlementController.adminGenerateSettlement);
router.get('/:id', requireAuth, requireRole('ADMIN'), settlementController.adminGetSettlementDetail);
router.post('/:id/approve', requireAuth, requireRole('ADMIN'), settlementController.adminApproveSettlement);
router.post('/:id/adjustments', requireAuth, requireRole('ADMIN'), settlementController.adminAddAdjustment);

export default router;
