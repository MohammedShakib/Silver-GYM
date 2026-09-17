import { storage } from '../storage/StorageAdapter';
import { mockUser } from '../../services/mockData';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

class MockMemberRepository {
  async getMember(id) {
    await delay();
    const members = storage.get('members');
    
    // Seed on first access if not exists
    if (!members[id] && id === storage.get('demoUserId')) {
      members[id] = { ...mockUser };
      storage.set('members', members);
    }
    
    if (!members[id]) throw new Error('Member not found');
    return members[id];
  }

  async updateMember(id, updates) {
    await delay();
    const members = storage.get('members');
    if (!members[id]) throw new Error('Member not found');
    
    members[id] = { ...members[id], ...updates };
    storage.set('members', members);
    return members[id];
  }

  async getSavedGyms(memberId) {
    await delay();
    const saved = storage.get('savedGyms') || [];
    return saved.filter(s => s.memberId === memberId).map(s => s.gymId);
  }

  async toggleSavedGym(memberId, gymId) {
    await delay();
    let saved = storage.get('savedGyms') || [];
    const exists = saved.find(s => s.memberId === memberId && s.gymId === gymId);
    
    if (exists) {
      saved = saved.filter(s => !(s.memberId === memberId && s.gymId === gymId));
    } else {
      saved.push({ memberId, gymId });
    }
    
    storage.set('savedGyms', saved);
    return !exists; // true if added, false if removed
  }
}

export const memberRepository = import.meta.env.VITE_DATA_MODE === 'api'
  ? (await import('./ApiMemberRepository')).ApiMemberRepository
  : new MockMemberRepository();
