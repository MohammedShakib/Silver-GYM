import { storage } from '../storage/StorageAdapter';
import { mockActivity } from '../../services/mockData';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

class MockCheckInRepository {
  async getCheckIns(memberId) {
    await delay();
    let checkIns = storage.get('checkIns') || [];
    
    // Seed initial activity for demo user
    if (checkIns.length === 0 && memberId === storage.get('demoUserId')) {
      checkIns = mockActivity.map(a => ({
        id: a.id.toString(),
        memberId,
        gymId: a.gymId,
        gymName: a.gym,
        title: a.title, // for achievements
        checkedInAt: a.date === 'Today' ? new Date().toISOString() : null, // Simplification
        date: a.date,
        time: a.time,
        duration: a.duration,
        type: a.type,
        status: 'verified',
        method: 'demo',
      }));
      storage.set('checkIns', checkIns);
    }

    return checkIns.filter(c => c.memberId === memberId);
  }

  async createCheckIn(data) {
    await delay(400); // slightly longer for simulation
    const checkIns = storage.get('checkIns') || [];
    
    const newCheckIn = {
      id: `CHK-${Date.now()}`,
      memberId: data.memberId,
      gymId: data.gymId,
      gymName: data.gymName,
      type: 'checkin',
      checkedInAt: new Date().toISOString(),
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 'In progress',
      status: 'verified',
      method: data.method || 'member_qr',
    };
    
    // Add to top of list
    checkIns.unshift(newCheckIn);
    storage.set('checkIns', checkIns);
    return newCheckIn;
  }
}

export const checkInRepository = new MockCheckInRepository();
