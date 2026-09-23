import { processCheckIn } from '../services/checkIns.service.js';
import { verifyGymCheckInCredential } from '../services/gymQr.service.js';
import { ApiError } from '../utils/errors.js';

export const createCheckIn = async (req, res, next) => {
  try {
    const { token, idempotencyKey } = req.body;
    const memberId = req.memberId;
    
    if (!token) throw new ApiError(400, 'MISSING_TOKEN', 'Gym QR token is required');

    // Verify Gym QR
    const gymCredential = await verifyGymCheckInCredential(token);

    const result = await processCheckIn({
      memberId,
      gymId: gymCredential.gymId,
      method: 'GYM_QR',
      idempotencyKey
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

import prisma from '../utils/prisma.js';

export const getHistory = async (req, res, next) => {
  try {
    const memberId = req.memberId;
    const checkIns = await prisma.checkIn.findMany({
      where: { memberId },
      include: { gym: { select: { name: true, logoUrl: true } } },
      orderBy: { checkedInAt: 'desc' },
      take: 10
    });
    res.json({ checkIns });
  } catch (error) {
    next(error);
  }
};
