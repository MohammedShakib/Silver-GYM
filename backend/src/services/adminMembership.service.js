import prisma from '../utils/prisma.js';
import { auditService } from './audit.service.js';

class AdminMembershipService {
  async getMemberships(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.planId) where.planId = filters.planId;

    const [memberships, total] = await Promise.all([
      prisma.membership.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          member: { select: { name: true, email: true, memberCode: true } },
          plan: { select: { name: true, accessTier: true } }
        }
      }),
      prisma.membership.count({ where })
    ]);

    return { memberships, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getPlans() {
    return prisma.membershipPlan.findMany({
      orderBy: { displayOrder: 'asc' }
    });
  }

  async updatePlan(adminUserId, planId, data) {
    // Note: Do not overwrite price retroactively for historical payments
    // In a real system, you might create a new version of the plan
    const { name, active, description, displayOrder } = data;
    
    const plan = await prisma.membershipPlan.update({
      where: { id: planId },
      data: { name, active, description, displayOrder }
    });

    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: 'PLAN_UPDATED',
      entityType: 'PLAN',
      entityId: planId,
      metadata: { name, active, displayOrder }
    });

    return plan;
  }
}

export const adminMembershipService = new AdminMembershipService();
