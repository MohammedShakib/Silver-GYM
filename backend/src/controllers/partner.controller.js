import { verifyPassToken } from '../services/pass.service.js';
import { processCheckIn } from '../services/checkIns.service.js';
import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

export const verifyMemberPass = async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { token, idempotencyKey } = req.body;
    const staffId = req.memberId;

    if (!token) throw new ApiError(400, 'MISSING_TOKEN', 'Pass token is required');

    // Verify staff is authorized for this gym
    const staff = await prisma.gymStaff.findUnique({
      where: {
        memberId_gymId: { memberId: staffId, gymId }
      }
    });

    if (!staff || !staff.active) {
      throw new ApiError(403, 'UNAUTHORIZED', 'You are not authorized to check-in members at this gym');
    }

    // 1. Verify Pass Token
    const passCredential = await verifyPassToken(token);

    // 2. Process check-in (marks pass as used)
    const result = await processCheckIn({
      memberId: passCredential.memberId,
      gymId,
      method: 'MEMBER_PASS',
      idempotencyKey,
      passCredentialId: passCredential.id
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

import { partnerAnalyticsService } from '../services/partnerAnalytics.service.js';
import { partnerService } from '../services/partner.service.js';

export const getGyms = async (req, res, next) => {
  try {
    const gyms = await partnerService.getStaffGyms(req.auth.userId);
    res.json({ gyms });
  } catch (error) {
    next(error);
  }
};

export const getOverview = async (req, res, next) => {
  try {
    const metrics = await partnerAnalyticsService.getOverview(req.params.gymId);
    const recentCheckIns = await partnerAnalyticsService.getRecentCheckIns(req.params.gymId);
    res.json({ metrics, recentCheckIns });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await partnerAnalyticsService.getAnalytics(req.params.gymId, Number(req.query.days) || 30);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

export const getRevenue = async (req, res, next) => {
  try {
    const revenue = await partnerAnalyticsService.getRevenue(req.params.gymId);
    res.json(revenue);
  } catch (error) {
    next(error);
  }
};

export const getCheckIns = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const checkIns = await partnerService.getCheckIns(req.params.gymId, page, limit, req.query.status);
    res.json({ checkIns });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await partnerService.getProfile(req.params.gymId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await partnerService.updateProfile(req.params.gymId, req.body);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateCrowdOverride = async (req, res, next) => {
  try {
    const { level, hours } = req.body;
    const gym = await partnerService.updateCrowdOverride(req.params.gymId, level, hours);
    res.json(gym);
  } catch (error) {
    next(error);
  }
};

export const getStaff = async (req, res, next) => {
  try {
    const staff = await partnerService.getStaff(req.params.gymId);
    res.json({ staff });
  } catch (error) {
    next(error);
  }
};

export const inviteStaff = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const invite = await partnerService.inviteStaff(req.params.gymId, email, role, req.auth.userId);
    res.json(invite); // Returning invite details (including token) for testing in Phase 8
  } catch (error) {
    next(error);
  }
};

export const removeStaff = async (req, res, next) => {
  try {
    await partnerService.removeStaff(req.params.gymId, req.params.staffId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const reviews = await partnerService.getReviews(req.params.gymId, page, limit);
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};

export const respondToReview = async (req, res, next) => {
  try {
    const response = await partnerService.respondToReview(req.params.gymId, req.params.reviewId, req.auth.userId, req.body.response);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getTrainers = async (req, res, next) => {
  try {
    const trainers = await partnerService.getTrainers(req.params.gymId);
    res.json({ trainers });
  } catch (error) {
    next(error);
  }
};

export const addTrainer = async (req, res, next) => {
  try {
    const trainer = await partnerService.addTrainer(req.params.gymId, req.body);
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

export const deleteTrainer = async (req, res, next) => {
  try {
    await partnerService.deleteTrainer(req.params.gymId, req.params.trainerId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
