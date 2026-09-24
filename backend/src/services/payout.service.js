import prisma from '../utils/prisma.js';
import EventService from './event.service.js';

export const payoutService = {
  /**
   * Initiates a manual payout for an approved settlement.
   * Ensures idempotency: only one active payout per settlement.
   */
  async initiatePayout(settlementId, actorUserId) {
    return prisma.$transaction(async (tx) => {
      const settlement = await tx.settlement.findUnique({ where: { id: settlementId } });
      if (!settlement) throw new Error('Settlement not found');
      
      if (settlement.status !== 'APPROVED') {
        throw new Error(`Cannot initiate payout for settlement in state: ${settlement.status}`);
      }

      // Check for existing active payout
      const existingPayout = await tx.payout.findFirst({
        where: {
          settlementId,
          status: { in: ['PENDING', 'PROCESSING', 'PAID'] }
        }
      });

      if (existingPayout) {
        throw new Error('An active payout already exists for this settlement');
      }

      const reference = `PO-${settlement.gymId.substring(0, 4).toUpperCase()}-${Date.now()}`;
      
      const payout = await tx.payout.create({
        data: {
          reference,
          gymId: settlement.gymId,
          settlementId,
          provider: 'MANUAL',
          amount: settlement.netAmount,
          currency: settlement.currency,
          status: 'PROCESSING',
          initiatedAt: new Date()
        }
      });

      await tx.settlement.update({
        where: { id: settlementId },
        data: { status: 'PAYOUT_PENDING' }
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          actorRole: 'ADMIN',
          action: 'PAYOUT_INITIATED',
          entityType: 'PAYOUT',
          entityId: payout.id,
          metadata: { amount: payout.amount, provider: payout.provider }
        }
      });

      return payout;
    });
  },

  /**
   * Confirms a manual payout, requiring an external transfer reference.
   */
  async confirmManualPayout(payoutId, providerTransferId, actorUserId) {
    return prisma.$transaction(async (tx) => {
      const payout = await tx.payout.findUnique({ where: { id: payoutId } });
      if (!payout) throw new Error('Payout not found');
      if (payout.status !== 'PROCESSING' || payout.provider !== 'MANUAL') {
        throw new Error('Only PROCESSING MANUAL payouts can be confirmed');
      }
      if (!providerTransferId) {
        throw new Error('Provider transfer reference is required for manual confirmation');
      }

      // Ensure provider transfer ID uniqueness
      const duplicateRef = await tx.payout.findUnique({
        where: { providerTransferId }
      });
      if (duplicateRef) {
        throw new Error('Provider transfer reference has already been used');
      }

      const updatedPayout = await tx.payout.update({
        where: { id: payoutId },
        data: {
          status: 'PAID',
          providerTransferId,
          completedAt: new Date()
        }
      });

      await tx.settlement.update({
        where: { id: payout.settlementId },
        data: { status: 'PAID' }
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          actorRole: 'ADMIN',
          action: 'PAYOUT_CONFIRMED_MANUAL',
          entityType: 'PAYOUT',
          entityId: payoutId,
          metadata: { providerTransferId }
        }
      });

      // Find Gym Owner to notify
      const gymOwner = await tx.gymStaff.findFirst({
        where: { gymId: payout.gymId, role: 'OWNER' },
        include: { gym: true }
      });

      if (gymOwner) {
        await EventService.publishEvent({
          eventType: 'PAYOUT_PAID',
          aggregateType: 'Payout',
          aggregateId: payoutId,
          dedupKey: `payout_paid_${payoutId}`,
          payload: {
            userId: gymOwner.memberId,
            amount: updatedPayout.amount,
            gymName: gymOwner.gym.name,
            reference: updatedPayout.reference
          }
        }, tx);
      }

      return updatedPayout;
    });
  }
};
