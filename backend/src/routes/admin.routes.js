import express from 'express';
const router = express.Router();
import { requireAuth, requireRole } from '../middlewares/auth.js';
import * as adminController from '../controllers/admin.controller.js';

// All admin routes require ADMIN role
router.use(requireAuth);
router.use(requireRole('ADMIN'));

// Overview
router.get('/overview', adminController.getOverview);

// Members
router.get('/members', adminController.getMembers);
router.get('/members/:id', adminController.getMemberDetail);
router.post('/members/:id/suspend', adminController.suspendMember);
router.post('/members/:id/reactivate', adminController.reactivateMember);

// Gyms
router.get('/gyms', adminController.getGyms);
router.get('/gyms/:id', adminController.getGymDetail);
router.post('/gyms/:id/status', adminController.updateGymStatus);
router.post('/gyms/:id/access-tier', adminController.updateGymAccessTier);
router.post('/gyms/:id/verification', adminController.updateGymVerification);

// Applications
router.get('/applications', adminController.getApplications);
router.post('/applications/:id/approve', adminController.approveApplication);
router.post('/applications/:id/reject', adminController.rejectApplication);

// Memberships & Plans
router.get('/memberships', adminController.getMemberships);
router.get('/plans', adminController.getPlans);
router.put('/plans/:id', adminController.updatePlan);

// Payments & Invoices
router.get('/payments', adminController.getPayments);
router.get('/invoices', adminController.getInvoices);

// Check-Ins
router.get('/check-ins', adminController.getCheckIns);

// Support
router.get('/support', adminController.getSupportCases);
router.put('/support/:id/status', adminController.updateSupportCaseStatus);

// Audit
router.get('/audit', adminController.getAuditLogs);

export default router;
