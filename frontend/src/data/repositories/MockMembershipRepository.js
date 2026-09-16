import { storage } from '../storage/StorageAdapter';
import { plans, mockUser } from '../../services/mockData';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

class MockMembershipRepository {
  async getPlans() {
    await delay();
    return [...plans];
  }

  async getMembership(memberId) {
    await delay();
    const memberships = storage.get('memberships') || {};
    
    // Seed initial membership for the demo user
    if (!memberships[memberId] && memberId === storage.get('demoUserId')) {
      const activePlan = plans.find(p => p.name === mockUser.plan) || plans[0];
      memberships[memberId] = {
        id: 'MEM-123',
        memberId,
        planId: activePlan.id,
        planName: activePlan.name,
        status: mockUser.status,
        monthlyVisitLimit: mockUser.visitsTotal,
        visitsUsed: mockUser.visitsUsed,
        visitsRemaining: mockUser.visitsRemaining,
        renewalDate: mockUser.renewalDate,
        streak: mockUser.streak,
      };
      storage.set('memberships', memberships);
    }

    if (!memberships[memberId]) return null;
    return memberships[memberId];
  }

  async updateMembership(memberId, updates) {
    await delay();
    const memberships = storage.get('memberships') || {};
    if (!memberships[memberId]) throw new Error('Membership not found');
    
    memberships[memberId] = { ...memberships[memberId], ...updates };
    storage.set('memberships', memberships);
    return memberships[memberId];
  }

  async activatePlan(memberId, planId) {
    await delay();
    const plan = plans.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan');

    const memberships = storage.get('memberships') || {};
    
    memberships[memberId] = {
      id: `MEM-${Date.now()}`,
      memberId,
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      monthlyVisitLimit: plan.visits,
      visitsUsed: 0,
      visitsRemaining: plan.visits,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      streak: 0,
    };

    storage.set('memberships', memberships);
    return memberships[memberId];
  }
}

export const membershipRepository = new MockMembershipRepository();
