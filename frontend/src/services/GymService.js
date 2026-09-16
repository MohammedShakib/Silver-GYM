import { gymRepository } from '../data/repositories/MockGymRepository';

class GymService {
  /**
   * Get gyms, optionally filtered and sorted
   */
  async getGyms(filters = {}) {
    let gyms = await gymRepository.getGyms(filters);
    
    // Additional service-level filtering
    if (filters.search) {
      const q = filters.search.toLowerCase();
      gyms = gyms.filter(g => g.name.toLowerCase().includes(q) || g.area.toLowerCase().includes(q));
    }
    
    // Sort
    if (filters.sort === 'nearest') {
      gyms.sort((a, b) => a.distance - b.distance);
    } else if (filters.sort === 'rating') {
      gyms.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'crowd') {
      gyms.sort((a, b) => a.crowdPct - b.crowdPct);
    }

    return gyms;
  }

  async getGym(id) {
    return gymRepository.getGymById(id);
  }

  async getAreas() {
    return gymRepository.getAreas();
  }

  getRecommendedGyms(gyms, member, limit = 1) {
    // Basic recommendation logic: 
    // In a real app, this would use ML or location. Here we just return the first one that matches member area, or nearest.
    if (!gyms || gyms.length === 0) return [];
    
    const prefArea = member?.location?.split(',')[0] || 'Mirpur';
    let match = gyms.find(g => g.area.includes(prefArea) && g.crowd !== 'full');
    
    if (!match) {
      match = [...gyms].sort((a, b) => a.distance - b.distance)[0];
    }
    return match ? [match] : [];
  }
}

export const gymService = new GymService();
