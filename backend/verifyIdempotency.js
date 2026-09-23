import { PrismaClient } from '@prisma/client';
import { processPaymentResult } from './src/services/payment.service.js';

const prisma = new PrismaClient();

async function run() {
  console.log('Testing Idempotency...');

  // 1. Setup mock payment
  const member = await prisma.member.findFirst({ where: { role: 'MEMBER' } });
  const plan = await prisma.membershipPlan.findFirst({ where: { id: 'active' } });

  const payment = await prisma.payment.create({
    data: {
      memberId: member.id,
      planId: plan.id,
      provider: 'DEMO',
      amount: plan.priceMonthly,
      currency: 'BDT',
      status: 'PENDING',
      idempotencyKey: `test_idem_${Date.now()}`
    }
  });

  const txId = `txn_${Date.now()}`;

  // 2. First Webhook Call
  console.log('Calling processPaymentResult first time...');
  const res1 = await processPaymentResult(payment.id, txId, 'PAID', plan.priceMonthly, 'BDT');
  console.log('First result status:', res1.status);

  // 3. Second Webhook Call (Duplicate)
  console.log('Calling processPaymentResult second time...');
  const res2 = await processPaymentResult(payment.id, txId, 'PAID', plan.priceMonthly, 'BDT');
  console.log('Second result status:', res2.status);

  // 4. Verify Membership Created only once
  const mCycles = await prisma.membershipCycle.findMany({
    where: {
      membership: {
        payments: { some: { id: payment.id } }
      }
    }
  });
  console.log('Membership Cycles created:', mCycles.length, '(Expected: 1)');

  console.log(mCycles.length === 1 ? 'SUCCESS' : 'FAILED');
}

run().catch(console.error).finally(() => prisma.$disconnect());
