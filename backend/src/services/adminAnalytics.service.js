import prisma from '../utils/prisma.js';

class AdminAnalyticsService {
  async getDashboardMetrics() {
    // 1. Total Active Members
    const activeMembers = await prisma.member.count({
      where: { status: 'ACTIVE', role: 'MEMBER' }
    });

    // 2. Active Partner Gyms
    const activePartnerGyms = await prisma.gym.count({
      where: { status: 'ACTIVE' }
    });

    // 3. Verified Check-Ins Today (UTC bounds simplified for demo)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkinsToday = await prisma.checkIn.count({
      where: {
        status: 'VERIFIED',
        checkedInAt: { gte: today }
      }
    });

    // 4. Monthly Subscription Revenue (Verified PAID Payments)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPayments = await prisma.payment.aggregate({
      where: {
        status: 'PAID',
        paidAt: { gte: thirtyDaysAgo }
      },
      _sum: {
        amount: true
      }
    });
    const monthlyRevenue = recentPayments._sum.amount || 0;

    // 5. Pending Gym Applications
    const pendingApplications = await prisma.gymApplication.count({
      where: { status: 'PENDING' }
    });

    // 6. Suspended Accounts
    const suspendedAccounts = await prisma.member.count({
      where: { status: 'SUSPENDED' }
    });

    // 7. Open Support Cases
    const openSupportCases = await prisma.supportCase.count({
      where: { status: 'OPEN' }
    });

    return {
      activeMembers,
      activePartnerGyms,
      checkinsToday,
      monthlyRevenue,
      pendingApplications,
      suspendedAccounts,
      openSupportCases
    };
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
