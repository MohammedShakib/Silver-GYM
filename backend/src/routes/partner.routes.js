import { Router } from 'express';
import { requireAuth, requireRole, requireGymAccess, requireGymPermission } from '../middlewares/auth.js';
import * as partnerController from '../controllers/partner.controller.js';

const router = Router();

router.use(requireAuth);

// Gym owner or staff can scan member pass
router.post('/gyms/:gymId/check-ins/member-pass', requireRole(['GYM_OWNER', 'ADMIN']), partnerController.verifyMemberPass);

// Staff accessible gyms
router.get('/gyms', partnerController.getGyms);

// Gym specific routes - require gym access context
router.use('/gyms/:gymId', requireGymAccess);

// Dashboard Overview (Owner, Manager, Receptionist)
router.get('/gyms/:gymId/overview', requireGymPermission(['OWNER', 'MANAGER', 'RECEPTIONIST']), partnerController.getOverview);

// Check-Ins (Owner, Manager, Receptionist)
router.get('/gyms/:gymId/check-ins', requireGymPermission(['OWNER', 'MANAGER', 'RECEPTIONIST']), partnerController.getCheckIns);

// Analytics (Owner, Manager)
router.get('/gyms/:gymId/analytics', requireGymPermission(['OWNER', 'MANAGER']), partnerController.getAnalytics);

// Revenue (Owner only)
router.get('/gyms/:gymId/revenue', requireGymPermission(['OWNER']), partnerController.getRevenue);

import { settlementController } from '../controllers/settlement.controller.js';
router.get('/gyms/:gymId/settlements', requireGymPermission(['OWNER']), settlementController.partnerGetSettlements);
router.get('/gyms/:gymId/settlements/:id', requireGymPermission(['OWNER']), settlementController.partnerGetSettlementDetail);

// Profile (Owner, Manager)
router.get('/gyms/:gymId/profile', requireGymPermission(['OWNER', 'MANAGER', 'RECEPTIONIST']), partnerController.getProfile);
router.patch('/gyms/:gymId/profile', requireGymPermission(['OWNER', 'MANAGER']), partnerController.updateProfile);
router.post('/gyms/:gymId/crowd-override', requireGymPermission(['OWNER', 'MANAGER']), partnerController.updateCrowdOverride);

// Trainers (Owner, Manager)
router.get('/gyms/:gymId/trainers', requireGymPermission(['OWNER', 'MANAGER', 'RECEPTIONIST']), partnerController.getTrainers);
router.post('/gyms/:gymId/trainers', requireGymPermission(['OWNER', 'MANAGER']), partnerController.addTrainer);
router.delete('/gyms/:gymId/trainers/:trainerId', requireGymPermission(['OWNER', 'MANAGER']), partnerController.deleteTrainer);

// Reviews (Owner, Manager)
router.get('/gyms/:gymId/reviews', requireGymPermission(['OWNER', 'MANAGER']), partnerController.getReviews);
router.post('/gyms/:gymId/reviews/:reviewId/respond', requireGymPermission(['OWNER', 'MANAGER']), partnerController.respondToReview);

// Staff (Owner only)
router.get('/gyms/:gymId/staff', requireGymPermission(['OWNER']), partnerController.getStaff);
router.post('/gyms/:gymId/staff/invite', requireGymPermission(['OWNER']), partnerController.inviteStaff);
router.delete('/gyms/:gymId/staff/:staffId', requireGymPermission(['OWNER']), partnerController.removeStaff);

export default router;
