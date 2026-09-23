import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function verifyGymCheckInCredential(rawToken) {
  const tokenHash = hashToken(rawToken);

  const credential = await prisma.gymCheckInCredential.findUnique({
    where: { tokenHash },
    include: { gym: true }
  });

  if (!credential) {
    throw new Error('GYM_QR_INVALID');
  }

  if (credential.status !== 'ACTIVE') {
    throw new Error('GYM_QR_REVOKED');
  }

  if (credential.gym.status !== 'ACTIVE') {
    throw new Error('GYM_CLOSED');
  }

  return credential;
}

export async function rotateGymCredential(gymId) {
  // Revoke existing
  await prisma.gymCheckInCredential.updateMany({
    where: { gymId, status: 'ACTIVE' },
    data: {
      status: 'REVOKED',
      rotatedAt: new Date()
    }
  });

  const rawToken = crypto.randomBytes(16).toString('hex');
  const tokenHash = hashToken(rawToken);

  await prisma.gymCheckInCredential.create({
    data: {
      gymId,
      tokenHash,
      status: 'ACTIVE'
    }
  });

  return rawToken;
}
