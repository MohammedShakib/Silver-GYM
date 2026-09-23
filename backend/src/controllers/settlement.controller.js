import { settlementService } from '../services/settlement.service.js';
import prisma from '../utils/prisma.js';

export const settlementController = {
  // Admin Endpoints
  async adminGetSettlements(req, res) {
    try {
      const { status, gymId, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (gymId) where.gymId = gymId;

      const [settlements, total] = await Promise.all([
        prisma.settlement.findMany({
          where,
          include: { gym: { select: { name: true } } },
          orderBy: { periodStart: 'desc' },
          skip: Number(skip),
          take: Number(limit)
        }),
        prisma.settlement.count({ where })
      ]);

      res.json({
        settlements,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch settlements' });
    }
  },

  async adminGetSettlementDetail(req, res) {
    try {
      const settlement = await prisma.settlement.findUnique({
        where: { id: req.params.id },
        include: {
          gym: true,
          lineItems: {
            include: { checkIn: true }
          },
          adjustments: true,
          payouts: true
        }
      });
      if (!settlement) return res.status(404).json({ message: 'Settlement not found' });
      res.json(settlement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch settlement details' });
    }
  },

  async adminGenerateSettlement(req, res) {
    try {
      const { gymId, periodStart, periodEnd } = req.body;
      const settlement = await settlementService.generateSettlement(
        gymId, 
        new Date(periodStart), 
        new Date(periodEnd), 
        req.auth.userId
      );
      res.json({ message: 'Settlement generated', settlement });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || 'Failed to generate settlement' });
    }
  },

  async adminApproveSettlement(req, res) {
    try {
      const settlement = await settlementService.approveSettlement(req.params.id, req.auth.userId);
      res.json({ message: 'Settlement approved', settlement });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || 'Failed to approve settlement' });
    }
  },

  async adminAddAdjustment(req, res) {
    try {
      const settlement = await settlementService.applyAdjustment(req.params.id, req.body, req.auth.userId);
      res.json({ message: 'Adjustment added', settlement });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message || 'Failed to add adjustment' });
    }
  },

  // Partner Endpoints
  async partnerGetSettlements(req, res) {
    try {
      const gymId = req.params.gymId;
      // Verify partner owns this gym (middleware should ensure they are staff of gymId)
      // For safety:
      const isStaff = await prisma.gymStaff.findUnique({
        where: { memberId_gymId: { memberId: req.auth.userId, gymId } }
      });
      if (!isStaff || (isStaff.role !== 'OWNER' && isStaff.role !== 'MANAGER')) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const settlements = await prisma.settlement.findMany({
        where: { gymId, status: { not: 'DRAFT' } }, // Hide drafts from partner
        orderBy: { periodStart: 'desc' }
      });

      res.json({ settlements });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch settlements' });
    }
  },

  async partnerGetSettlementDetail(req, res) {
    try {
      const gymId = req.params.gymId;
      const isStaff = await prisma.gymStaff.findUnique({
        where: { memberId_gymId: { memberId: req.auth.userId, gymId } }
      });
      if (!isStaff || (isStaff.role !== 'OWNER' && isStaff.role !== 'MANAGER')) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const settlement = await prisma.settlement.findUnique({
        where: { id: req.params.id },
        include: {
          lineItems: true, // we might not want to send all check-in PII
          adjustments: true,
          payouts: true
        }
      });

      if (!settlement || settlement.gymId !== gymId || settlement.status === 'DRAFT') {
        return res.status(404).json({ message: 'Settlement not found' });
      }
      res.json(settlement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch settlement details' });
    }
  }
};
