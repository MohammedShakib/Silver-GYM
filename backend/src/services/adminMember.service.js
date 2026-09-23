import prisma from '../utils/prisma.js';
import { auditService } from './audit.service.js';

class AdminMemberService {
  async getMembers(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { memberCode: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    if (filters.status) where.status = filters.status;
    if (filters.role) where.role = filters.role;

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          memberCode: true,
          name: true,
          email: true,
          status: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.member.count({ where })
    ]);

    return { members, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getMemberDetail(id) {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        memberships: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' }
        },
        checkIns: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { gym: { select: { name: true } } }
        },
        payments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { plan: { select: { name: true } } }
        }
      }
    });

    if (!member) throw new Error('MEMBER_NOT_FOUND');
    
    // Remove sensitive data
    delete member.passwordHash;

    return member;
  }

  async suspendMember(adminUserId, memberId, reason) {
    if (!reason) throw new Error('REASON_REQUIRED');

    const member = await prisma.member.update({
      where: { id: memberId },
      data: { status: 'SUSPENDED' }
    });

    // Invalidate sessions (simplified)
    await prisma.session.deleteMany({
      where: { memberId }
    });

    // Audit log
    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: 'USER_SUSPENDED',
      entityType: 'MEMBER',
      entityId: memberId,
      metadata: { reason }
    });

    return member;
  }

  async reactivateMember(adminUserId, memberId) {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { status: 'ACTIVE' }
    });

    // Audit log
    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: 'USER_REACTIVATED',
      entityType: 'MEMBER',
      entityId: memberId,
      metadata: {}
    });

    return member;
  }
}

export const adminMemberService = new AdminMemberService();
