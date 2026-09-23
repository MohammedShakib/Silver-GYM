import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';
import { markPassTokenUsed } from './pass.service.js';

const TIER_LEVELS = {
  'STANDARD': 1,
  'ACTIVE': 2,
  'PREMIUM': 3
};

const CHECKIN_DUPLICATE_WINDOW_MINUTES = parseInt(process.env.CHECKIN_DUPLICATE_WINDOW_MINUTES || '120', 10);

export const processCheckIn = async ({ memberId, gymId, method, idempotencyKey, passCredentialId }) => {
  // 1. Idempotency Check Outside Transaction
  if (idempotencyKey) {
    const existing = await prisma.checkIn.findUnique({
      where: { idempotencyKey },
      include: { membership: true }
    });
    if (existing) {
      return { checkIn: existing, membership: existing.membership };
    }
  }

  return await prisma.$transaction(async (tx) => {
    // 2. Lock member's active membership (prevent concurrent check-in consuming same visit)
    // We use findFirst since findUnique can't easily lock multiple nested relation rows in a single simple query in Prisma
    // But in Prisma, doing an update will implicitly lock the row.
    const member = await tx.member.findUnique({
      where: { id: memberId },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: { plan: true, cycles: { where: { status: 'ACTIVE' }, orderBy: { startsAt: 'desc' }, take: 1 } }
        }
      }
    });

    if (!member) throw new ApiError(404, ErrorCodes.MEMBER_NOT_FOUND, 'Member not found or suspended');

    const membership = member.memberships[0];
    if (!membership) throw new ApiError(403, ErrorCodes.MEMBERSHIP_INACTIVE, 'No active membership found');

    const currentCycle = membership.cycles[0];
    if (!currentCycle) throw new ApiError(403, ErrorCodes.MEMBERSHIP_INACTIVE, 'No active membership cycle found');

    // 3. Verify Gym is ACTIVE and Check Tier
    const gym = await tx.gym.findUnique({ where: { id: gymId } });
    if (!gym || gym.status !== 'ACTIVE') throw new ApiError(404, ErrorCodes.GYM_NOT_FOUND, 'Gym is not available for check-in');

    const planTierLevel = TIER_LEVELS[membership.plan.accessTier.toUpperCase()] || 1;
    const gymTierLevel = TIER_LEVELS[gym.accessTier.toUpperCase()] || 1;
    
    if (planTierLevel < gymTierLevel) {
      throw new ApiError(403, ErrorCodes.GYM_ACCESS_DENIED, 'Your plan does not include access to this gym tier');
    }

    // 4. Verify Visits Remaining
    if (currentCycle.visitLimit !== null && currentCycle.visitsUsed >= currentCycle.visitLimit) {
      throw new ApiError(403, ErrorCodes.NO_VISITS_REMAINING, 'No visits remaining in the current membership cycle');
    }

    // 5. Prevent Duplicate Check-In at same gym within cooldown window
    const windowStart = new Date(Date.now() - CHECKIN_DUPLICATE_WINDOW_MINUTES * 60 * 1000);
    const recentCheckIn = await tx.checkIn.findFirst({
      where: {
        memberId,
        gymId,
        checkedInAt: { gte: windowStart }
      }
    });

    if (recentCheckIn) {
      throw new ApiError(409, ErrorCodes.ALREADY_CHECKED_IN, 'You have already checked in here recently');
    }

    // 6. If passCredentialId is provided, mark it USED (ensures it cannot be reused even concurrently)
    if (passCredentialId) {
      const pass = await tx.passCredential.findUnique({ where: { id: passCredentialId } });
      if (!pass || pass.status !== 'ACTIVE') {
        throw new ApiError(401, 'PASS_INVALID', 'Pass credential is no longer valid');
      }
      if (new Date() > pass.expiresAt) {
        throw new ApiError(401, 'PASS_EXPIRED', 'Pass credential expired');
      }
      
      await tx.passCredential.update({
        where: { id: passCredentialId },
        data: { status: 'USED', usedAt: new Date() }
      });
    }

    // 7. Atomic update of visits and creation of checkIn
    // We increment cycle visitsUsed. If it exceeds visitLimit concurrently, Prisma won't natively catch it unless we use raw query locks or optimistic concurrency.
    // However, the findFirst block above acts as a check.
    
    const updatedCycle = await tx.membershipCycle.update({
      where: { id: currentCycle.id },
      data: { visitsUsed: { increment: 1 } }
    });

    // Final sanity check inside transaction
    if (updatedCycle.visitLimit !== null && updatedCycle.visitsUsed > updatedCycle.visitLimit) {
      throw new ApiError(403, ErrorCodes.NO_VISITS_REMAINING, 'Concurrency error: No visits remaining');
    }

    // Also update global membership visitsUsed (legacy field)
    const updatedMembership = await tx.membership.update({
      where: { id: membership.id },
      data: { visitsUsed: { increment: 1 } }
    });

    const checkIn = await tx.checkIn.create({
      data: {
        memberId,
        gymId,
        membershipId: membership.id,
        method,
        status: 'VERIFIED',
        idempotencyKey
      }
    });

    return {
      checkIn,
      membership: updatedMembership,
      cycle: updatedCycle
    };
  });
};
