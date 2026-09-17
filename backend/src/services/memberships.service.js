import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

export const getCurrentMembership = async (memberId) => {
  const membership = await prisma.membership.findFirst({
    where: { 
      memberId,
      status: 'ACTIVE'
    },
    include: {
      plan: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!membership) {
    throw new ApiError(404, ErrorCodes.MEMBERSHIP_NOT_FOUND, 'No active membership found');
  }

  // Calculate visits remaining safely
  let visitsRemaining = null;
  if (membership.plan.visitLimit !== null) {
    visitsRemaining = Math.max(0, membership.plan.visitLimit - membership.visitsUsed);
  }

  return {
    ...membership,
    visitsRemaining
  };
};
