export class EligibilityService {
  /**
   * Determine if a member can access a specific gym
   * @param {Object} membership - The current active membership
   * @param {Object} plan - The plan details
   * @param {Object} gym - The gym to check
   * @returns {'included'|'upgrade_required'|'membership_expired'|'no_visits_remaining'|'unavailable'}
   */
  static getGymAccessStatus({ membership, plan, gym }) {
    if (!membership || membership.status !== 'active') return 'membership_expired';
    if (!plan || !gym) return 'unavailable';

    // Simple tier logic for demo:
    // If the plan has "Premium gyms" in missing features, and the gym plans list doesn't include the member's plan
    if (!gym.plans.includes(plan.name)) {
      return 'upgrade_required';
    }

    if (membership.visitsRemaining <= 0) return 'no_visits_remaining';

    return 'included';
  }
}
