import prisma from '../utils/prisma.js';
import { commercialTermsService } from './commercialTerms.service.js';

export const settlementService = {
  /**
   * Generates a settlement for a specific gym and period.
   * Idempotent: if a settlement already exists for this period and is not DRAFT/CALCULATED, it aborts.
   * If it is DRAFT/CALCULATED, it deletes line items and recalculates.
   */
  async generateSettlement(gymId, periodStart, periodEnd, actorUserId = 'SYSTEM') {
    return prisma.$transaction(async (tx) => {
      // 1. Check if settlement exists
      let settlement = await tx.settlement.findUnique({
        where: {
          gymId_periodStart_periodEnd: {
            gymId,
            periodStart,
            periodEnd
          }
        }
      });

      if (settlement) {
        if (!['DRAFT', 'CALCULATED'].includes(settlement.status)) {
          throw new Error(`Settlement already exists and is in locked state: ${settlement.status}`);
        }
        // Delete existing line items for recalculation
        await tx.settlementLineItem.deleteMany({
          where: { settlementId: settlement.id }
        });
      } else {
        const reference = `SET-${gymId.substring(0, 4).toUpperCase()}-${periodStart.toISOString().substring(0, 7).replace('-', '')}`;
        settlement = await tx.settlement.create({
          data: {
            reference,
            gymId,
            periodStart,
            periodEnd,
            status: 'DRAFT'
          }
        });
      }

      // 2. Find eligible check-ins (VERIFIED, within period, not settled yet)
      const eligibleCheckIns = await tx.checkIn.findMany({
        where: {
          gymId,
          status: 'VERIFIED',
          checkedInAt: {
            gte: periodStart,
            lt: periodEnd
          },
          settlementLineItem: null // ensure it's not already linked to another settlement
        }
      });

      // 3. Create line items
      let grossAmount = 0;
      let billableVisitCount = 0;

      for (const checkIn of eligibleCheckIns) {
        // Resolve rate at the time of check-in
        const terms = await commercialTermsService.getActiveTermsForDate(gymId, checkIn.checkedInAt);
        const rate = terms.ratePerVisit;

        await tx.settlementLineItem.create({
          data: {
            settlementId: settlement.id,
            checkInId: checkIn.id,
            gymId,
            rateAmount: rate,
            currency: terms.currency,
            serviceDate: checkIn.checkedInAt,
            amount: rate
          }
        });

        grossAmount += rate;
        billableVisitCount++;
      }

      // 4. Calculate Net
      const adjustments = await tx.settlementAdjustment.findMany({
        where: { settlementId: settlement.id }
      });

      let positiveAdjustments = 0;
      let negativeAdjustments = 0;

      adjustments.forEach(adj => {
        if (adj.direction === 'CREDIT') positiveAdjustments += adj.amount;
        else if (adj.direction === 'DEBIT') negativeAdjustments += adj.amount;
      });

      const netAmount = grossAmount + positiveAdjustments - negativeAdjustments;

      // 5. Update settlement
      const updatedSettlement = await tx.settlement.update({
        where: { id: settlement.id },
        data: {
          grossAmount,
          positiveAdjustments,
          negativeAdjustments,
          netAmount,
          billableVisitCount,
          status: 'CALCULATED',
          calculatedAt: new Date()
        }
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          actorRole: 'ADMIN',
          action: 'SETTLEMENT_GENERATED',
          entityType: 'SETTLEMENT',
          entityId: settlement.id,
          metadata: { periodStart, periodEnd, grossAmount, netAmount, billableVisitCount }
        }
      });

      return updatedSettlement;
    }, {
      timeout: 30000 // allow more time for large generation
    });
  },

  /**
   * Approves a settlement.
   */
  async approveSettlement(settlementId, actorUserId) {
    return prisma.$transaction(async (tx) => {
      const settlement = await tx.settlement.findUnique({ where: { id: settlementId } });
      if (!settlement) throw new Error('Settlement not found');
      if (settlement.status !== 'CALCULATED') {
        throw new Error(`Cannot approve settlement in state: ${settlement.status}`);
      }

      const updated = await tx.settlement.update({
        where: { id: settlementId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: actorUserId
        }
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          actorRole: 'ADMIN',
          action: 'SETTLEMENT_APPROVED',
          entityType: 'SETTLEMENT',
          entityId: settlementId,
          metadata: { netAmount: settlement.netAmount }
        }
      });

      return updated;
    });
  },

  /**
   * Adds an adjustment to a settlement.
   */
  async applyAdjustment(settlementId, data, actorUserId) {
    return prisma.$transaction(async (tx) => {
      const settlement = await tx.settlement.findUnique({ where: { id: settlementId } });
      if (!settlement) throw new Error('Settlement not found');
      if (['APPROVED', 'PAYOUT_PENDING', 'PAID', 'CANCELLED'].includes(settlement.status)) {
        throw new Error('Cannot adjust a locked settlement');
      }

      const adjustment = await tx.settlementAdjustment.create({
        data: {
          settlementId,
          type: data.type,
          direction: data.direction,
          amount: data.amount,
          reason: data.reason,
          createdBy: actorUserId
        }
      });

      // Recalculate totals inline
      const newGross = settlement.grossAmount;
      const newPositive = settlement.positiveAdjustments + (data.direction === 'CREDIT' ? data.amount : 0);
      const newNegative = settlement.negativeAdjustments + (data.direction === 'DEBIT' ? data.amount : 0);
      const newNet = newGross + newPositive - newNegative;

      const updated = await tx.settlement.update({
        where: { id: settlementId },
        data: {
          positiveAdjustments: newPositive,
          negativeAdjustments: newNegative,
          netAmount: newNet
        }
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          actorRole: 'ADMIN',
          action: 'SETTLEMENT_ADJUSTED',
          entityType: 'SETTLEMENT',
          entityId: settlementId,
          metadata: { adjustmentId: adjustment.id, amount: data.amount, direction: data.direction }
        }
      });

      return updated;
    });
  }
};
