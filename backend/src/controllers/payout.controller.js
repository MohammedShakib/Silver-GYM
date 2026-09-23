import { payoutService } from '../services/payout.service.js';
import prisma from '../utils/prisma.js';

export const payoutController = {
  // Admin Endpoints
  async adminGetPayouts(req, res) {
    try {
      const { status, gymId, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (gymId) where.gymId = gymId;

      const [payouts, total] = await Promise.all([
        prisma.payout.findMany({
          where,
          include: { gym: { select: { name: true } }, settlement: { select: { reference: true, periodStart: true } } },
          orderBy: { createdAt: 'desc' },
          skip: Number(skip),
          take: Number(limit)
        }),
        prisma.payout.count({ where })
      ]);

      res.json({
        payouts,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch payouts' });
    }
  },

  async adminInitiatePayout(req, res) {
    try {
      const payout = await payoutService.initiatePayout(req.params.settlementId, req.auth.userId);
      res.json({ message: 'Payout initiated', payout });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || 'Failed to initiate payout' });
    }
  },

  async adminConfirmManualPayout(req, res) {
    try {
      const { providerTransferId } = req.body;
      const payout = await payoutService.confirmManualPayout(req.params.id, providerTransferId, req.auth.userId);
      res.json({ message: 'Manual payout confirmed', payout });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || 'Failed to confirm payout' });
    }
  }
};
