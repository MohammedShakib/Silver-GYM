import { verifyPassToken } from '../services/pass.service.js';
import { processCheckIn } from '../services/checkIns.service.js';
import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

export const verifyMemberPass = async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { token, idempotencyKey } = req.body;
    const staffId = req.memberId;

    if (!token) throw new ApiError(400, 'MISSING_TOKEN', 'Pass token is required');

    // Verify staff is authorized for this gym
    const staff = await prisma.gymStaff.findUnique({
      where: {
        memberId_gymId: { memberId: staffId, gymId }
      }
    });

    if (!staff || !staff.active) {
      throw new ApiError(403, 'UNAUTHORIZED', 'You are not authorized to check-in members at this gym');
    }

    // 1. Verify Pass Token
    const passCredential = await verifyPassToken(token);

    // 2. Process check-in (marks pass as used)
    const result = await processCheckIn({
      memberId: passCredential.memberId,
      gymId,
      method: 'MEMBER_PASS',
      idempotencyKey,
      passCredentialId: passCredential.id
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
