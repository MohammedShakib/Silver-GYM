import prisma from '../utils/prisma.js';
import { auditService } from './audit.service.js';

class AdminGymService {
  async getGyms(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
        { area: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    if (filters.status) where.status = filters.status;
    if (filters.verified !== undefined) where.verified = filters.verified === 'true';

    const [gyms, total] = await Promise.all([
      prisma.gym.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          staff: {
            where: { role: 'OWNER' },
            include: { member: { select: { name: true, email: true } } }
          }
        }
      }),
      prisma.gym.count({ where })
    ]);

    return { gyms, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getGymDetail(id) {
    const gym = await prisma.gym.findUnique({
      where: { id },
      include: {
        staff: {
          include: { member: { select: { name: true, email: true, memberCode: true } } }
        },
        amenities: {
          include: { amenity: true }
        },
        openingHours: true
      }
    });

    if (!gym) throw new Error('GYM_NOT_FOUND');
    return gym;
  }

  async updateGymStatus(adminUserId, gymId, status, reason) {
    if (status === 'SUSPENDED' && !reason) throw new Error('REASON_REQUIRED');

    const gym = await prisma.gym.update({
      where: { id: gymId },
      data: { status }
    });

    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: status === 'SUSPENDED' ? 'GYM_SUSPENDED' : 'GYM_REACTIVATED',
      entityType: 'GYM',
      entityId: gymId,
      metadata: { status, reason }
    });

    return gym;
  }

  async updateGymAccessTier(adminUserId, gymId, accessTier) {
    const gym = await prisma.gym.update({
      where: { id: gymId },
      data: { accessTier }
    });

    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: 'GYM_TIER_CHANGED',
      entityType: 'GYM',
      entityId: gymId,
      metadata: { accessTier }
    });

    return gym;
  }

  async updateGymVerification(adminUserId, gymId, verified) {
    const gym = await prisma.gym.update({
      where: { id: gymId },
      data: { verified }
    });

    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: 'GYM_VERIFICATION_UPDATED',
      entityType: 'GYM',
      entityId: gymId,
      metadata: { verified }
    });

    return gym;
  }
}

export const adminGymService = new AdminGymService();
