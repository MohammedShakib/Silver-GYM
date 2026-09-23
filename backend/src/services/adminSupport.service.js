import prisma from '../utils/prisma.js';
import { auditService } from './audit.service.js';

class AdminSupportService {
  async getCases(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    
    const [cases, total] = await Promise.all([
      prisma.supportCase.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.supportCase.count({ where })
    ]);

    return { cases, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getCaseDetail(id) {
    const supportCase = await prisma.supportCase.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });
    if (!supportCase) throw new Error('CASE_NOT_FOUND');
    return supportCase;
  }

  async updateCaseStatus(adminUserId, id, status) {
    const updated = await prisma.supportCase.update({
      where: { id },
      data: { status, resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : null }
    });

    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: 'SUPPORT_CASE_STATUS_CHANGED',
      entityType: 'SUPPORT_CASE',
      entityId: id,
      metadata: { status }
    });

    return updated;
  }
}

export const adminSupportService = new AdminSupportService();
