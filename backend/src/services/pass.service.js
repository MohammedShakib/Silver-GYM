import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { getCurrentMembership } from './memberships.service.js';

const prisma = new PrismaClient();

const PASS_TOKEN_TTL_SECONDS = parseInt(process.env.PASS_TOKEN_TTL_SECONDS || '45', 10);

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function generatePassToken(memberId) {
  // 1. Verify Member has active membership
  const membership = await getCurrentMembership(memberId);
  if (!membership || membership.status !== 'ACTIVE') {
    throw new Error('MEMBERSHIP_INACTIVE');
  }

  // 2. Invalidate previous active credentials for this member
  await prisma.passCredential.updateMany({
    where: {
      memberId,
      status: 'ACTIVE'
    },
    data: {
      status: 'REVOKED',
      revokedAt: new Date()
    }
  });

  // 3. Generate new crypto token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + PASS_TOKEN_TTL_SECONDS * 1000);

  // 4. Store the hash
  await prisma.passCredential.create({
    data: {
      memberId,
      tokenHash,
      expiresAt,
      status: 'ACTIVE'
    }
  });

  // Return the raw token ONLY once
  return {
    token: rawToken,
    expiresAt,
    ttl: PASS_TOKEN_TTL_SECONDS
  };
}

export async function verifyPassToken(rawToken) {
  const tokenHash = hashToken(rawToken);

  const credential = await prisma.passCredential.findUnique({
    where: { tokenHash },
    include: { member: true }
  });

  if (!credential) {
    throw new Error('PASS_INVALID');
  }

  if (credential.status === 'USED') {
    throw new Error('PASS_USED');
  }

  if (credential.status !== 'ACTIVE') {
    throw new Error('PASS_REVOKED');
  }

  if (new Date() > credential.expiresAt) {
    // Automatically mark as expired
    await prisma.passCredential.update({
      where: { id: credential.id },
      data: { status: 'EXPIRED' }
    });
    throw new Error('PASS_EXPIRED');
  }

  return credential;
}

export async function markPassTokenUsed(credentialId) {
  await prisma.passCredential.update({
    where: { id: credentialId },
    data: {
      status: 'USED',
      usedAt: new Date()
    }
  });
}
