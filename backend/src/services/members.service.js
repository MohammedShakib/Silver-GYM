import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

export const getMemberProfile = async (memberId) => {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      preferences: true,
      savedLocations: true
    }
  });

  if (!member) {
    throw new ApiError(404, ErrorCodes.MEMBER_NOT_FOUND, 'Member not found');
  }

  return member;
};

export const getMemberActivity = async (memberId) => {
  const checkIns = await prisma.checkIn.findMany({
    where: { memberId },
    orderBy: { checkedInAt: 'desc' },
    include: { gym: true }
  });

  // Calculate simple streak and stats
  const workoutCount = checkIns.length;
  // Unique gyms
  const gymIds = new Set(checkIns.map(c => c.gymId));
  const gymsVisited = gymIds.size;

  return {
    recentActivity: checkIns.slice(0, 10), // Limit to 10 for Phase 3 API
    workoutCount,
    gymsVisited,
    currentStreak: workoutCount > 0 ? 4 : 0 // Stub for now, can implement complex streak logic later
  };
};

export const getMemberSavedGyms = async (memberId) => {
  const saved = await prisma.savedGym.findMany({
    where: { memberId },
    include: {
      gym: {
        include: { images: true, amenities: { include: { amenity: true } } }
      }
    }
  });

  return saved.map(s => s.gym);
};

export const saveGym = async (memberId, gymId) => {
  try {
    return await prisma.savedGym.create({
      data: { memberId, gymId }
    });
  } catch (err) {
    // Ignore duplicate creation
    if (err.code === 'P2002') return { memberId, gymId };
    throw err;
  }
};

export const unsaveGym = async (memberId, gymId) => {
  try {
    await prisma.savedGym.delete({
      where: { memberId_gymId: { memberId, gymId } }
    });
  } catch (err) {
    // Ignore if not found
    if (err.code === 'P2025') return;
    throw err;
  }
};
