import prisma from '../utils/prisma.js';
import crypto from 'crypto';

export const partnerService = {
  // Gym Context
  async getStaffGyms(userId) {
    return prisma.gymStaff.findMany({
      where: { memberId: userId, active: true },
      include: {
        gym: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            accessTier: true,
            status: true
          }
        }
      }
    });
  },

  // Profile
  async getProfile(gymId) {
    return prisma.gym.findUnique({
      where: { id: gymId },
      include: {
        openingHours: true,
        amenities: { include: { amenity: true } },
        trainers: true
      }
    });
  },

  async updateProfile(gymId, data) {
    const allowedFields = ['name', 'description', 'phone', 'email', 'address', 'area', 'city', 'latitude', 'longitude', 'capacity'];
    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }
    return prisma.gym.update({
      where: { id: gymId },
      data: updateData
    });
  },
  
  async updateCrowdOverride(gymId, level, hours) {
    const expiresAt = hours ? new Date(Date.now() + hours * 60 * 60 * 1000) : null;
    return prisma.gym.update({
      where: { id: gymId },
      data: {
        crowdOverrideLevel: level,
        crowdOverrideExpiresAt: expiresAt
      }
    });
  },

  // Staff Management
  async getStaff(gymId) {
    return prisma.gymStaff.findMany({
      where: { gymId },
      include: {
        member: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        }
      }
    });
  },

  async inviteStaff(gymId, email, role, inviterId) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.staffInvitation.create({
      data: { gymId, email, role, tokenHash, expiresAt, invitedBy: inviterId }
    });

    // In a real app, send email here. For Phase 8, we return the token for testing.
    return { token, email, role };
  },

  async removeStaff(gymId, staffId) {
    // Basic protection to prevent deleting the last owner.
    const staffMember = await prisma.gymStaff.findUnique({ where: { id: staffId } });
    if (!staffMember) throw new Error('Staff not found');
    
    if (staffMember.role === 'OWNER') {
      const ownerCount = await prisma.gymStaff.count({
        where: { gymId, role: 'OWNER', active: true }
      });
      if (ownerCount <= 1) throw new Error('Cannot remove the last owner of the gym');
    }

    return prisma.gymStaff.delete({ where: { id: staffId } });
  },

  // Reviews
  async getReviews(gymId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return prisma.review.findMany({
      where: { gymId },
      include: {
        member: { select: { name: true, avatarUrl: true } },
        response: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
  },

  async respondToReview(gymId, reviewId, authorUserId, responseText) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.gymId !== gymId) throw new Error('Review not found for this gym');

    return prisma.reviewResponse.upsert({
      where: { reviewId },
      create: { reviewId, gymId, authorUserId, response: responseText },
      update: { response: responseText, authorUserId }
    });
  },
  
  // Check-ins History for partner
  async getCheckIns(gymId, page = 1, limit = 50, status) {
    const where = { gymId };
    if (status) where.status = status;
    
    return prisma.checkIn.findMany({
      where,
      include: {
        member: { select: { name: true, memberCode: true, avatarUrl: true } },
        membership: { include: { plan: true } }
      },
      orderBy: { checkedInAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });
  },
  
  // Trainers
  async getTrainers(gymId) {
    return prisma.trainer.findMany({ where: { gymId } });
  },
  
  async addTrainer(gymId, data) {
    return prisma.trainer.create({
      data: { gymId, ...data }
    });
  },
  
  async deleteTrainer(gymId, trainerId) {
    return prisma.trainer.delete({
      where: { id: trainerId }
    });
  }
};
