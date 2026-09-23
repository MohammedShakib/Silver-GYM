import prisma from '../utils/prisma.js';
import { auditService } from './audit.service.js';

class AdminApplicationService {
  async getApplications(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    
    const [applications, total] = await Promise.all([
      prisma.gymApplication.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.gymApplication.count({ where })
    ]);

    return { applications, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getApplicationDetail(id) {
    const application = await prisma.gymApplication.findUnique({
      where: { id }
    });
    if (!application) throw new Error('APPLICATION_NOT_FOUND');
    return application;
  }

  async approveApplication(adminUserId, id) {
    // We use a transaction so if Gym creation fails, application state is not stuck
    const application = await prisma.gymApplication.findUnique({ where: { id } });
    if (!application) throw new Error('APPLICATION_NOT_FOUND');
    if (application.status === 'APPROVED') throw new Error('ALREADY_APPROVED');

    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark approved
      const updatedApp = await tx.gymApplication.update({
        where: { id },
        data: { status: 'APPROVED', assignedReviewerId: adminUserId }
      });

      // 2. Generate slug safely
      const baseSlug = updatedApp.gymName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

      // 3. Create Gym
      const gym = await tx.gym.create({
        data: {
          name: updatedApp.gymName,
          slug,
          address: updatedApp.address,
          area: updatedApp.area,
          email: updatedApp.contactEmail,
          phone: updatedApp.contactPhone,
          status: 'ACTIVE',
          verified: true, // Approve sets it to verified initially
          accessTier: 'STANDARD'
        }
      });

      // 4. Create Owner Relationship
      await tx.gymStaff.create({
        data: {
          memberId: updatedApp.applicantUserId,
          gymId: gym.id,
          role: 'OWNER',
          active: true
        }
      });

      // 5. Audit
      await tx.auditLog.create({
        data: {
          actorUserId: adminUserId,
          actorRole: 'ADMIN',
          action: 'GYM_APPLICATION_APPROVED',
          entityType: 'APPLICATION',
          entityId: id,
          metadata: { gymId: gym.id }
        }
      });

      return { application: updatedApp, gym };
    });

    return result;
  }

  async rejectApplication(adminUserId, id, reason) {
    if (!reason) throw new Error('REASON_REQUIRED');

    const application = await prisma.gymApplication.findUnique({ where: { id } });
    if (!application) throw new Error('APPLICATION_NOT_FOUND');
    if (application.status === 'REJECTED' || application.status === 'APPROVED') {
      throw new Error('INVALID_APPLICATION_STATE');
    }

    const updated = await prisma.gymApplication.update({
      where: { id },
      data: { status: 'REJECTED', notes: reason, assignedReviewerId: adminUserId }
    });

    await auditService.record({
      actorUserId: adminUserId,
      actorRole: 'ADMIN',
      action: 'GYM_APPLICATION_REJECTED',
      entityType: 'APPLICATION',
      entityId: id,
      metadata: { reason }
    });

    return updated;
  }
}

export const adminApplicationService = new AdminApplicationService();
