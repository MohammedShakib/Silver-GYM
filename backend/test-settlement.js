import prisma from './src/utils/prisma.js';
import { settlementService } from './src/services/settlement.service.js';
import { commercialTermsService } from './src/services/commercialTerms.service.js';
import { payoutService } from './src/services/payout.service.js';

async function run() {
  try {
    console.log('--- Setting up Test Data ---');
    // 1. Get any active gym
    const gym = await prisma.gym.findFirst();
    if (!gym) throw new Error('No gym found');

    // 2. Set Commercial Terms to 100 BDT (10000 paisa)
    console.log('Setting commercial terms...');
    await commercialTermsService.setNewTerms(gym.id, {
      ratePerVisit: 10000,
      currency: 'BDT',
      effectiveFrom: new Date('2026-01-01T00:00:00Z')
    }, 'SYSTEM');

    // 3. Get any member and membership
    const member = await prisma.member.findFirst();
    const plan = await prisma.membershipPlan.findFirst();
    
    let membership = await prisma.membership.findFirst({ where: { memberId: member.id } });
    if (!membership) {
        membership = await prisma.membership.create({
            data: {
                memberId: member.id,
                planId: plan.id,
                status: 'ACTIVE',
                startsAt: new Date(),
                visitsUsed: 0
            }
        });
    }

    // 4. Create 5 dummy verified check-ins in current month
    const now = new Date();
    const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    
    console.log('Creating mock check-ins...');
    for (let i = 0; i < 5; i++) {
      await prisma.checkIn.create({
        data: {
          gymId: gym.id,
          memberId: member.id,
          membershipId: membership.id,
          status: 'VERIFIED',
          checkedInAt: new Date(periodStart.getTime() + (i + 1) * 24 * 60 * 60 * 1000) // spread over days
        }
      });
    }

    console.log('--- Running Settlement Flow ---');
    
    // 5. Generate Settlement
    console.log('Generating settlement...');
    const settlement = await settlementService.generateSettlement(gym.id, periodStart, periodEnd);
    console.log(`Generated: Gross ${settlement.grossAmount}, Net ${settlement.netAmount}, Visits ${settlement.billableVisitCount}`);

    // 6. Test Idempotency (should overwrite/recalculate)
    console.log('Re-generating settlement (idempotency test)...');
    const settlement2 = await settlementService.generateSettlement(gym.id, periodStart, periodEnd);
    if (settlement2.id !== settlement.id) throw new Error('Idempotency failed: Created new settlement record');
    
    // 7. Add Adjustment
    console.log('Adding adjustment (+5000 BDT)...');
    const adjusted = await settlementService.applyAdjustment(settlement.id, {
      type: 'MANUAL_CORRECTION',
      direction: 'CREDIT',
      amount: 5000,
      reason: 'Bonus'
    }, 'SYSTEM');
    console.log(`Net after adjustment: ${adjusted.netAmount}`);
    if (adjusted.netAmount !== settlement.grossAmount + 5000) throw new Error('Adjustment calculation failed');

    // 8. Approve Settlement
    console.log('Approving settlement...');
    await settlementService.approveSettlement(settlement.id, 'SYSTEM');

    // 9. Initiate Payout
    console.log('Initiating payout...');
    const payout = await payoutService.initiatePayout(settlement.id, 'SYSTEM');
    
    // 10. Confirm Payout
    console.log('Confirming payout...');
    await payoutService.confirmManualPayout(payout.id, 'TEST-REF-123', 'SYSTEM');

    console.log('--- Flow Complete Successfully! ---');

  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
