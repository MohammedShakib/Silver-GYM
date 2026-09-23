import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

export const getCurrentMembership = async (memberId) => {
  const membership = await prisma.membership.findFirst({
    where: { 
      memberId,
      status: 'ACTIVE'
    },
    include: {
      plan: true,
      cycles: {
        where: { status: 'ACTIVE' },
        orderBy: { startsAt: 'desc' },
        take: 1
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!membership) {
    throw new ApiError(404, ErrorCodes.MEMBERSHIP_NOT_FOUND, 'No active membership found');
  }

  const currentCycle = membership.cycles[0];
  const visitsUsed = currentCycle ? currentCycle.visitsUsed : membership.visitsUsed;
  const cycleEndsAt = currentCycle ? currentCycle.endsAt : membership.cycleEndsAt;

  let visitsRemaining = null;
  if (membership.plan.visitLimit !== null) {
    visitsRemaining = Math.max(0, membership.plan.visitLimit - visitsUsed);
  }

  return {
    ...membership,
    visitsUsed,
    cycleEndsAt,
    visitsRemaining
  };
};

export const activateOrUpdateMembershipTx = async (tx, memberId, planId, type) => {
  const plan = await tx.membershipPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error('Plan not found');

  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  if (type === 'NEW_MEMBERSHIP') {
    const membership = await tx.membership.create({
      data: {
        memberId,
        planId,
        status: 'ACTIVE',
        startsAt: now,
        renewsAt: nextMonth,
        cycleStartsAt: now,
        cycleEndsAt: nextMonth,
        visitsUsed: 0,
        autoRenew: true
      }
    });

    await tx.membershipCycle.create({
      data: {
        membershipId: membership.id,
        startsAt: now,
        endsAt: nextMonth,
        visitLimit: plan.visitLimit,
        visitsUsed: 0
      }
    });
    return membership;
  } else if (type === 'UPGRADE' || type === 'DOWNGRADE_ADJUSTMENT') {
    // End old membership
    const oldMembership = await tx.membership.findFirst({
      where: { memberId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (oldMembership) {
      await tx.membership.update({
        where: { id: oldMembership.id },
        data: { status: 'CANCELED', endsAt: now }
      });
      // End old cycles
      await tx.membershipCycle.updateMany({
        where: { membershipId: oldMembership.id, status: 'ACTIVE' },
        data: { status: 'ENDED', endsAt: now }
      });
    }

    // Start new membership
    const newMembership = await tx.membership.create({
      data: {
        memberId,
        planId,
        status: 'ACTIVE',
        startsAt: now,
        renewsAt: nextMonth,
        cycleStartsAt: now,
        cycleEndsAt: nextMonth,
        visitsUsed: 0,
        autoRenew: true
      }
    });

    await tx.membershipCycle.create({
      data: {
        membershipId: newMembership.id,
        startsAt: now,
        endsAt: nextMonth,
        visitLimit: plan.visitLimit,
        visitsUsed: 0
      }
    });
    return newMembership;
  }
};

export const pauseMembership = async (memberId) => {
  const membership = await prisma.membership.findFirst({
    where: { memberId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });
  if (!membership) throw new ApiError(404, ErrorCodes.MEMBERSHIP_NOT_FOUND, 'No active membership found');
  
  return await prisma.membership.update({
    where: { id: membership.id },
    data: { status: 'PAUSED' }
  });
};

export const cancelMembership = async (memberId) => {
  const membership = await prisma.membership.findFirst({
    where: { memberId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });
  if (!membership) throw new ApiError(404, ErrorCodes.MEMBERSHIP_NOT_FOUND, 'No active membership found');
  
  // Set autoRenew to false, it will expire at cycle end
  return await prisma.membership.update({
    where: { id: membership.id },
    data: { autoRenew: false }
  });
};
