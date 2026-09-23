import prisma from '../utils/prisma.js';
import { auditService } from './audit.service.js';

class AdminPaymentService {
  async getPayments(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { initiatedAt: 'desc' },
        include: {
          member: { select: { name: true, email: true } },
          plan: { select: { name: true } }
        }
      }),
      prisma.payment.count({ where })
    ]);

    return { payments, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getInvoices(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { issuedAt: 'desc' },
        include: {
          member: { select: { name: true, email: true } }
        }
      }),
      prisma.invoice.count({ where })
    ]);

    return { invoices, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const adminPaymentService = new AdminPaymentService();
