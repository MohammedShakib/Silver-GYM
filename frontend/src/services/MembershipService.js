import { membershipRepository } from '../data/repositories/MockMembershipRepository';

class MembershipService {
  async getPlans() {
    return membershipRepository.getPlans();
  }

  async getCurrentMembership(userId) {
    return membershipRepository.getMembership(userId);
  }

  async activatePlan(userId, planId) {
    return membershipRepository.activatePlan(userId, planId);
  }
}

export const membershipService = new MembershipService();
