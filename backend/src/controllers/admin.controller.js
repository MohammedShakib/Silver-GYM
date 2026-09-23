import { adminAnalyticsService } from '../services/adminAnalytics.service.js';
import { adminMemberService } from '../services/adminMember.service.js';
import { adminGymService } from '../services/adminGym.service.js';
import { adminApplicationService } from '../services/adminApplication.service.js';
import { adminMembershipService } from '../services/adminMembership.service.js';
import { adminPaymentService } from '../services/adminPayment.service.js';
import { adminCheckInService } from '../services/adminCheckIn.service.js';
import { adminSupportService } from '../services/adminSupport.service.js';
import { auditService } from '../services/audit.service.js';

// Overview
export const getOverview = async (req, res) => {
  try {
    const metrics = await adminAnalyticsService.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard metrics' });
  }
};

// Members
export const getMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminMemberService.getMembers(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members' });
  }
};

export const getMemberDetail = async (req, res) => {
  try {
    const member = await adminMemberService.getMemberDetail(req.params.id);
    res.json(member);
  } catch (error) {
    if (error.message === 'MEMBER_NOT_FOUND') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Failed to fetch member details' });
  }
};

export const suspendMember = async (req, res) => {
  try {
    const member = await adminMemberService.suspendMember(req.auth.userId, req.params.id, req.body.reason);
    res.json(member);
  } catch (error) {
    if (error.message === 'REASON_REQUIRED') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Failed to suspend member' });
  }
};

export const reactivateMember = async (req, res) => {
  try {
    const member = await adminMemberService.reactivateMember(req.auth.userId, req.params.id);
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reactivate member' });
  }
};

// Gyms
export const getGyms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminGymService.getGyms(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gyms' });
  }
};

export const getGymDetail = async (req, res) => {
  try {
    const gym = await adminGymService.getGymDetail(req.params.id);
    res.json(gym);
  } catch (error) {
    if (error.message === 'GYM_NOT_FOUND') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Failed to fetch gym details' });
  }
};

export const updateGymStatus = async (req, res) => {
  try {
    const gym = await adminGymService.updateGymStatus(req.auth.userId, req.params.id, req.body.status, req.body.reason);
    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update gym status' });
  }
};

export const updateGymAccessTier = async (req, res) => {
  try {
    const gym = await adminGymService.updateGymAccessTier(req.auth.userId, req.params.id, req.body.accessTier);
    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update gym access tier' });
  }
};

export const updateGymVerification = async (req, res) => {
  try {
    const gym = await adminGymService.updateGymVerification(req.auth.userId, req.params.id, req.body.verified);
    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update gym verification' });
  }
};

// Applications
export const getApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminApplicationService.getApplications(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const result = await adminApplicationService.approveApplication(req.auth.userId, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to approve application' });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const result = await adminApplicationService.rejectApplication(req.auth.userId, req.params.id, req.body.reason);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to reject application' });
  }
};

// Memberships & Plans
export const getMemberships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminMembershipService.getMemberships(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch memberships' });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await adminMembershipService.getPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await adminMembershipService.updatePlan(req.auth.userId, req.params.id, req.body);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update plan' });
  }
};

// Payments & Invoices
export const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminPaymentService.getPayments(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminPaymentService.getInvoices(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
};

// Check-Ins
export const getCheckIns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminCheckInService.getCheckIns(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch check-ins' });
  }
};

// Support
export const getSupportCases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await adminSupportService.getCases(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch support cases' });
  }
};

export const updateSupportCaseStatus = async (req, res) => {
  try {
    const result = await adminSupportService.updateCaseStatus(req.auth.userId, req.params.id, req.body.status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update support case' });
  }
};

// Audit Log
export const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await auditService.getLogs(page, limit, req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};
