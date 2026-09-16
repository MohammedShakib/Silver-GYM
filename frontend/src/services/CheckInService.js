import { checkInRepository } from '../data/repositories/MockCheckInRepository';
import { membershipRepository } from '../data/repositories/MockMembershipRepository';
import { gymRepository } from '../data/repositories/MockGymRepository';
import { EligibilityService } from './EligibilityService';

class CheckInService {
  /**
   * Orchestrates the check-in process
   */
  async checkIn(userId, gymId) {
    const membership = await membershipRepository.getMembership(userId);
    const gym = await gymRepository.getGymById(gymId);
    const plans = await membershipRepository.getPlans();
    const activePlan = plans.find(p => p.id === membership.planId);

    const status = EligibilityService.getGymAccessStatus({ membership, plan: activePlan, gym });
    
    if (status !== 'included') {
      throw new Error(`Cannot check in. Status: ${status}`);
    }

    // 1. Create the check-in record
    const checkIn = await checkInRepository.createCheckIn({
      memberId: userId,
      gymId: gym.id,
      gymName: gym.name,
      method: 'member_qr'
    });

    // 2. Update membership visits usage
    await membershipRepository.updateMembership(userId, {
      visitsUsed: membership.visitsUsed + 1,
      visitsRemaining: Math.max(0, membership.visitsRemaining - 1),
    });

    return checkIn;
  }
}

export const checkInService = new CheckInService();
