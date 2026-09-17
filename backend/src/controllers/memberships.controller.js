import { getCurrentMembership } from '../services/memberships.service.js';

export const getMyMembership = async (req, res, next) => {
  try {
    const membership = await getCurrentMembership(req.memberId);
    res.json(membership);
  } catch (error) {
    next(error);
  }
};
