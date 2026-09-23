import prisma from '../utils/prisma.js';

class AdminCheckInService {
  async getCheckIns(page = 1, limit = 50, filters = {}) {
    const offset = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.method) where.method = filters.method;

    const [checkIns, total] = await Promise.all([
      prisma.checkIn.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { checkedInAt: 'desc' },
        include: {
          member: { select: { name: true, memberCode: true } },
          gym: { select: { name: true } }
        }
      }),
      prisma.checkIn.count({ where })
    ]);

    return { checkIns, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const adminCheckInService = new AdminCheckInService();
