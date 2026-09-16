import { checkInRepository } from '../data/repositories/MockCheckInRepository';
import { weeklyData, rewards } from './mockData'; // we can keep the static chart mock for now, but hook it up to service

class ActivityService {
  async getActivity(userId) {
    const checkIns = await checkInRepository.getCheckIns(userId);
    
    // In a real app, we'd derive streak and weekly trends from checkIns.
    // For demo purposes, we will return the list of checkIns.
    
    return {
      history: checkIns,
      weeklyData: weeklyData, // Static mock for charts
      rewards: rewards,       // Static mock for rewards
      workoutCount: checkIns.filter(c => c.type === 'checkin').length,
    };
  }
}

export const activityService = new ActivityService();
