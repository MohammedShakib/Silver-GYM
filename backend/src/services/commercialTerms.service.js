import prisma from '../utils/prisma.js';

export const commercialTermsService = {
  /**
   * Get the active commercial terms for a gym on a specific date.
   */
  async getActiveTermsForDate(gymId, date) {
    const terms = await prisma.gymCommercialTerms.findFirst({
      where: {
        gymId,
        status: 'ACTIVE',
        effectiveFrom: { lte: date },
        OR: [
          { effectiveUntil: null },
          { effectiveUntil: { gt: date } }
        ]
      },
      orderBy: { effectiveFrom: 'desc' }
    });

    if (!terms) {
      // Fallback: check if the gym has an accessTier we can use to generate default terms
      const gym = await prisma.gym.findUnique({
        where: { id: gymId },
        select: { accessTier: true }
      });
      if (!gym) throw new Error(`Gym ${gymId} not found`);

      // Default rates mapping
      const TIER_RATES = {
        STANDARD: 20000, // 200 BDT in paisa
        PLUS: 35000,
        PREMIUM: 50000,
        VIP: 60000
      };

      const ratePerVisit = TIER_RATES[gym.accessTier] || 20000;
      
      // Auto-create default terms starting from gym creation (effectively beginning of time for this system)
      return prisma.gymCommercialTerms.create({
        data: {
          gymId,
          ratePerVisit,
          effectiveFrom: new Date('2020-01-01T00:00:00Z'),
        }
      });
    }

    return terms;
  },

  /**
   * Set new commercial terms for a gym, expiring the old ones.
   */
  async setNewTerms(gymId, data, actorUserId) {
    return prisma.$transaction(async (tx) => {
      // Find current active terms
      const currentTerms = await tx.gymCommercialTerms.findFirst({
        where: {
          gymId,
          status: 'ACTIVE',
          effectiveUntil: null
        }
      });

      const effectiveFrom = data.effectiveFrom ? new Date(data.effectiveFrom) : new Date();

      if (currentTerms) {
        if (currentTerms.effectiveFrom >= effectiveFrom) {
          throw new Error('New terms must be effective after the current terms');
        }
        // Expire current terms
        await tx.gymCommercialTerms.update({
          where: { id: currentTerms.id },
          data: { effectiveUntil: effectiveFrom }
        });
      }

      // Create new terms
      const newTerms = await tx.gymCommercialTerms.create({
        data: {
          gymId,
          ratePerVisit: data.ratePerVisit,
          currency: data.currency || 'BDT',
          effectiveFrom,
        }
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          actorUserId,
          actorRole: 'ADMIN',
          action: 'COMMERCIAL_TERMS_CHANGED',
          entityType: 'GYM',
          entityId: gymId,
          metadata: {
            newRate: data.ratePerVisit,
            effectiveFrom
          }
        }
      });

      return newTerms;
    });
  }
};
