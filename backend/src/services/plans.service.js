import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

export const getAllPlans = async () => {
  return prisma.membershipPlan.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' }
  });
};

export const getPlan = async (idOrSlug) => {
  const plan = await prisma.membershipPlan.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug }
      ]
    }
  });

  if (!plan) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Membership plan not found.');
  }

  return plan;
};
