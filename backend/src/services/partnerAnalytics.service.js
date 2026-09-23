import prisma from '../utils/prisma.js';

/**
 * Basic mapping of access tier to estimated payout rate.
 * In Phase 10 this will be replaced with real GymCommercialTerms.
 */
const TIER_RATES = {
  STANDARD: 200,
  PLUS: 350,
  PREMIUM: 500
};

export const partnerAnalyticsService = {
  /**
   * Get KPI metrics for the overview dashboard.
   */
  async getOverview(gymId) {
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { accessTier: true }
    });
    
    if (!gym) throw new Error('Gym not found');

    const rate = TIER_RATES[gym.accessTier] || 200;
    
    // Time bounds
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Today's Check-ins
    const checkInsToday = await prisma.checkIn.count({
      where: { gymId, checkedInAt: { gte: startOfDay }, status: 'VERIFIED' }
    });

    // Currently Active / Recent (last 2 hours)
    const recentVisitors = await prisma.checkIn.count({
      where: { gymId, checkedInAt: { gte: twoHoursAgo }, status: 'VERIFIED' }
    });

    // Unique members this month
    const monthlyCheckIns = await prisma.checkIn.findMany({
      where: { gymId, checkedInAt: { gte: startOfMonth }, status: 'VERIFIED' },
      select: { memberId: true }
    });
    const uniqueMembers = new Set(monthlyCheckIns.map(c => c.memberId)).size;

    // Estimated revenue this month
    const verifiedVisitsThisMonth = monthlyCheckIns.length;
    const estimatedRevenueThisMonth = verifiedVisitsThisMonth * rate;

    // Average rating
    const reviewAgg = await prisma.review.aggregate({
      where: { gymId },
      _avg: { rating: true }
    });
    
    return {
      checkInsToday,
      recentVisitors,
      uniqueMembersThisMonth: uniqueMembers,
      estimatedRevenueThisMonth,
      averageRating: reviewAgg._avg.rating || 0
    };
  },

  /**
   * Get recent verified check-ins for the feed.
   */
  async getRecentCheckIns(gymId, limit = 10) {
    return prisma.checkIn.findMany({
      where: { gymId, status: 'VERIFIED' },
      orderBy: { checkedInAt: 'desc' },
      take: limit,
      include: {
        member: {
          select: { name: true, memberCode: true, avatarUrl: true }
        },
        membership: {
          include: { plan: true }
        }
      }
    });
  },

  /**
   * Get analytics charts data.
   */
  async getAnalytics(gymId, days = 30) {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    const checkIns = await prisma.checkIn.findMany({
      where: {
        gymId,
        status: 'VERIFIED',
        checkedInAt: { gte: startDate }
      },
      include: {
        membership: { include: { plan: true } }
      }
    });

    // Aggregations in memory (feasible for smaller operational subsets; could use raw SQL for huge data)
    
    // 1. Daily Visits
    const visitsByDate = {};
    // 2. Peak Hours
    const visitsByHour = Array(24).fill(0);
    // 3. Plan Distribution
    const visitsByPlan = {};

    checkIns.forEach(c => {
      // Date formatting for key (YYYY-MM-DD)
      const d = new Date(c.checkedInAt);
      const dateStr = d.toISOString().split('T')[0];
      
      visitsByDate[dateStr] = (visitsByDate[dateStr] || 0) + 1;
      
      const hour = d.getHours();
      visitsByHour[hour]++;

      const planName = c.membership?.plan?.name || 'Unknown';
      visitsByPlan[planName] = (visitsByPlan[planName] || 0) + 1;
    });

    const dailyVisits = Object.entries(visitsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      dailyVisits,
      peakHours: visitsByHour,
      membershipMix: visitsByPlan,
      totalVisitsPeriod: checkIns.length
    };
  },
  
  /**
   * Get estimated revenue data.
   */
  async getRevenue(gymId) {
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { accessTier: true }
    });
    
    if (!gym) throw new Error('Gym not found');
    const rate = TIER_RATES[gym.accessTier] || 200;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Current month
    const thisMonthVisits = await prisma.checkIn.count({
      where: { gymId, checkedInAt: { gte: startOfMonth }, status: 'VERIFIED' }
    });
    
    // Last month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    
    const lastMonthVisits = await prisma.checkIn.count({
      where: { gymId, checkedInAt: { gte: startOfLastMonth, lte: endOfLastMonth }, status: 'VERIFIED' }
    });
    
    return {
      ratePerVisit: rate,
      thisMonth: {
        verifiedVisits: thisMonthVisits,
        estimatedEarnings: thisMonthVisits * rate
      },
      lastMonth: {
        verifiedVisits: lastMonthVisits,
        estimatedEarnings: lastMonthVisits * rate
      }
    };
  }
};
