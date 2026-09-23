import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import * as partnerController from '../controllers/partner.controller.js';

const router = Router();

router.use(requireAuth);
// Gym owner or staff can scan member pass
router.post('/gyms/:gymId/check-ins/member-pass', requireRole(['GYM_OWNER', 'ADMIN']), partnerController.verifyMemberPass);

export default router;
