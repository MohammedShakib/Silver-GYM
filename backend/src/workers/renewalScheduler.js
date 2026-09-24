import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RenewalScheduler {
  constructor() {
    this.isRunning = false;
    // Run once an hour in production, but configurable
    this.interval = parseInt(process.env.RENEWAL_SCHEDULER_INTERVAL) || 3600000;
  }

  start() {
    console.log('[RenewalScheduler] Starting...');
    this.isRunning = true;
    this.run();
  }

  stop() {
    this.isRunning = false;
  }

  async run() {
    while (this.isRunning) {
      try {
        await this.processRenewals();
      } catch (error) {
        console.error('[RenewalScheduler] Error in run loop:', error);
      }
      await new Promise(resolve => setTimeout(resolve, this.interval));
    }
  }

  async processRenewals() {
    // Look for memberships that are active and auto-renew, and expire within 3 days.
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);

    const memberships = await prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        autoRenew: true,
        renewsAt: {
          lte: targetDate,
          gte: new Date()
        }
      },
      include: {
        plan: true
      }
    });

    for (const membership of memberships) {
      // Dedup key ensures we only notify once for a specific renewal window per membership
      const renewalWindowId = membership.renewsAt ? membership.renewsAt.toISOString().split('T')[0] : 'unknown';
      const dedupKey = `RENEWAL_REMINDER:${membership.id}:${renewalWindowId}`;

      try {
        const existingEvent = await prisma.domainEventOutbox.findUnique({
          where: { dedupKey }
        });

        if (!existingEvent) {
          await prisma.domainEventOutbox.create({
            data: {
              eventType: 'MEMBERSHIP_RENEWAL_DUE',
              aggregateType: 'MEMBERSHIP',
              aggregateId: membership.id,
              dedupKey,
              payload: {
                userId: membership.memberId,
                planName: membership.plan.name,
                renewalDate: membership.renewsAt,
                amount: membership.plan.priceMonthly
              }
            }
          });
          console.log(`[RenewalScheduler] Scheduled renewal reminder for membership ${membership.id}`);
        }
      } catch (error) {
         console.error(`[RenewalScheduler] Failed to schedule reminder for membership ${membership.id}`, error);
      }
    }
  }
}

export default new RenewalScheduler();
