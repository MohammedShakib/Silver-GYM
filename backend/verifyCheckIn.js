import { processCheckIn } from './src/services/checkIns.service.js';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function run() {
  console.log('Testing CheckIn Idempotency & Concurrency...');

  const member = await prisma.member.findUnique({ where: { memberCode: 'SG-2048-DA' } });
  if (!member) throw new Error('Test member not found');

  const gym = await prisma.gym.findUnique({ where: { slug: 'iron-house-fitness' } });
  if (!gym) throw new Error('Test gym not found');

  const membership = await prisma.membership.findFirst({ where: { memberId: member.id, status: 'ACTIVE' } });
  
  // Ensure an active cycle exists
  await prisma.membershipCycle.deleteMany({ where: { membershipId: membership.id } });
  await prisma.membershipCycle.create({
    data: {
      membershipId: membership.id,
      startsAt: new Date(Date.now() - 24 * 3600 * 1000),
      endsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      visitLimit: 15,
      visitsUsed: 0,
      status: 'ACTIVE'
    }
  });

  // Ensure no previous check-ins block it (duplicate window rule)
  await prisma.checkIn.deleteMany({
    where: { memberId: member.id, gymId: gym.id }
  });

  const idempotencyKey = crypto.randomUUID();

  console.log('Spawning 5 concurrent check-in requests with SAME idempotency key...');
  
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      processCheckIn({
        memberId: member.id,
        gymId: gym.id,
        method: 'MEMBER_PASS',
        idempotencyKey
      }).catch(e => e.message)
    );
  }

  const results = await Promise.all(promises);
  console.log('\nResults from 5 concurrent identical requests:');
  
  let successCount = 0;
  let errorCount = 0;
  
  results.forEach((r, idx) => {
    if (r.checkIn) {
      console.log(`Req ${idx}: SUCCESS - CheckIn ID: ${r.checkIn.id}`);
      successCount++;
    } else {
      console.log(`Req ${idx}: ERROR/IDEMPOTENT - ${r}`);
      errorCount++;
    }
  });

  console.log(`\nIdempotency test completed. Succeses: ${successCount}, Errors/Idempotent returns: ${errorCount}`);
  
  // Since we use idempotency key and Postgres transactions, 
  // one request will insert and the others should either return the existing check-in (via first check)
  // or hit the unique constraint error (which might throw an unhandled prisma error if they race, 
  // but it's safe because only ONE visit is deducted).
  // Wait, if they race past the first check and hit the unique constraint, it throws.
  
  await prisma.$disconnect();
}

run().catch(console.error);
