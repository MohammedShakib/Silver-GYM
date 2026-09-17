import { mockGyms, AREAS } from '../../services/mockData';

// Simulate network latency
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

class MockGymRepository {
  /**
   * Fetch all gyms, optionally filtered
   */
  async getGyms(filters = {}) {
    await delay();
    let results = [...mockGyms];
    
    // Simple mock filtering
    if (filters.area) {
      results = results.filter(g => g.area.includes(filters.area));
    }
    return results;
  }

  /**
   * Fetch a single gym by ID
   */
  async getGymById(id) {
    await delay();
    const gym = mockGyms.find(g => g.id === id);
    if (!gym) throw new Error('Gym not found');
    return gym;
  }

  /**
   * Fetch areas/locations
   */
  async getAreas() {
    await delay(100);
    return [...AREAS];
  }
}

export const gymRepository = import.meta.env.VITE_DATA_MODE === 'api' 
  ? (await import('./ApiGymRepository')).ApiGymRepository 
  : new MockGymRepository();
