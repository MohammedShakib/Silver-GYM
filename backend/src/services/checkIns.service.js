import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

const TIER_LEVELS = {
  'STANDARD': 1,
  'ACTIVE': 2,
  'PREMIUM': 3
};

export const processCheckIn = async (memberId, gymId, method = 'DEMO') => {
  return await prisma.$transaction(async (tx) => {
    // 1 & 2 & 3. Get member with active membership and plan
    const member = await tx.member.findUnique({
      where: { id: memberId },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: { plan: true }
        }
      }
    });

    if (!member) {
      throw new ApiError(404, ErrorCodes.MEMBER_NOT_FOUND, 'Member not found');
    }

    const membership = member.memberships[0];
    if (!membership) {
      throw new ApiError(403, ErrorCodes.MEMBERSHIP_INACTIVE, 'No active membership found');
    }

    // 4. Gym exists and is ACTIVE
    const gym = await tx.gym.findUnique({
      where: { id: gymId }
    });

    if (!gym || gym.status !== 'ACTIVE') {
      throw new ApiError(404, ErrorCodes.GYM_NOT_FOUND, 'Gym is not available for check-in');
    }

    // 5. Check gym tier
    const planTierLevel = TIER_LEVELS[membership.plan.accessTier.toUpperCase()] || 1;
    const gymTierLevel = TIER_LEVELS[gym.accessTier.toUpperCase()] || 1;
    
    if (planTierLevel < gymTierLevel) {
      throw new ApiError(403, ErrorCodes.GYM_ACCESS_DENIED, 'Your plan does not include access to this gym tier');
    }

    // 6. Check visit limit
    if (membership.plan.visitLimit !== null && membership.visitsUsed >= membership.plan.visitLimit) {
      throw new ApiError(403, ErrorCodes.NO_VISITS_REMAINING, 'No visits remaining in the current membership cycle');
    }

    // 7. Prevent obvious duplicate check-in (e.g. within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCheckIn = await tx.checkIn.findFirst({
      where: {
        memberId,
        gymId,
        createdAt: { gte: oneHourAgo }
      }
    });

    if (recentCheckIn) {
      throw new ApiError(409, ErrorCodes.ALREADY_CHECKED_IN, 'You have already checked in here recently');
    }

    // Create check-in
    const checkIn = await tx.checkIn.create({
      data: {
        memberId,
        gymId,
        membershipId: membership.id,
        method,
        status: 'VERIFIED'
      }
    });

    // Increment visits
    const updatedMembership = await tx.membership.update({
      where: { id: membership.id },
      data: {
        visitsUsed: {
          increment: 1
        }
      }
    });

    return {
      checkIn,
      membership: updatedMembership
    };
  });
};
