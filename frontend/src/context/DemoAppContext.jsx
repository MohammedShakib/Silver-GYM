import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser, mockGyms, mockActivity, plans } from '../services/mockData';

const DemoAppContext = createContext();

export function useDemoApp() {
  const context = useContext(DemoAppContext);
  if (!context) {
    throw new Error('useDemoApp must be used within a DemoAppProvider');
  }
  return context;
}

export function DemoAppProvider({ children }) {
  // Initialize state from localStorage or mock data
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sg_demo_user');
    return saved ? JSON.parse(saved) : mockUser;
  });

  const [gyms, setGyms] = useState(() => {
    const saved = localStorage.getItem('sg_demo_gyms');
    return saved ? JSON.parse(saved) : mockGyms;
  });

  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem('sg_demo_activity');
    return saved ? JSON.parse(saved) : mockActivity;
  });

  const [savedGymIds, setSavedGymIds] = useState(() => {
    const saved = localStorage.getItem('sg_demo_saved_gyms');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('sg_demo_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sg_demo_gyms', JSON.stringify(gyms));
  }, [gyms]);

  useEffect(() => {
    localStorage.setItem('sg_demo_activity', JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    localStorage.setItem('sg_demo_saved_gyms', JSON.stringify(savedGymIds));
  }, [savedGymIds]);

  // Actions
  const loginDemoUser = () => {
    setUser({ ...mockUser, status: 'active' });
  };

  const logoutUser = () => {
    setUser(null);
  };

  const updateOnboarding = (preferences) => {
    setUser((prev) => ({
      ...prev,
      ...preferences,
    }));
  };

  const activatePlan = (planId) => {
    const selectedPlan = plans.find((p) => p.id === planId);
    if (!selectedPlan) return;

    setUser((prev) => ({
      ...prev,
      plan: selectedPlan.name,
      visitsTotal: typeof selectedPlan.visits === 'number' ? selectedPlan.visits : 9999,
      visitsUsed: 0,
      visitsRemaining: typeof selectedPlan.visits === 'number' ? selectedPlan.visits : 9999,
      status: 'active',
      renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
    }));
  };

  const checkInToGym = (gymId) => {
    const gym = gyms.find((g) => g.id === gymId);
    if (!gym) return false;

    // Prevent obvious duplicates (already checked into same gym "Today")
    const alreadyCheckedInToday = activity.some(
      (a) => a.gymId === gymId && a.type === 'checkin' && a.date === 'Today'
    );
    if (alreadyCheckedInToday) {
      console.warn('Already checked into this gym today.');
      return false;
    }

    if (user.visitsRemaining <= 0) return false;

    // Update User Visits
    setUser((prev) => ({
      ...prev,
      visitsUsed: prev.visitsUsed + 1,
      visitsRemaining: prev.visitsRemaining - 1,
      streak: prev.streak + 1,
    }));

    // Add Activity
    const newActivity = {
      id: Date.now(),
      type: 'checkin',
      gym: gym.name,
      gymId: gym.id,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 'Ongoing',
    };
    setActivity((prev) => [newActivity, ...prev]);

    return true; // Success
  };

  const toggleSaveGym = (gymId) => {
    setSavedGymIds((prev) =>
      prev.includes(gymId) ? prev.filter((id) => id !== gymId) : [...prev, gymId]
    );
  };

  const resetDemoState = () => {
    localStorage.removeItem('sg_demo_user');
    localStorage.removeItem('sg_demo_gyms');
    localStorage.removeItem('sg_demo_activity');
    localStorage.removeItem('sg_demo_saved_gyms');
    setUser(mockUser);
    setGyms(mockGyms);
    setActivity(mockActivity);
    setSavedGymIds([]);
  };

  return (
    <DemoAppContext.Provider
      value={{
        user,
        gyms,
        activity,
        savedGymIds,
        plans,
        actions: {
          loginDemoUser,
          logoutUser,
          updateOnboarding,
          activatePlan,
          checkInToGym,
          toggleSaveGym,
          resetDemoState,
        },
      }}
    >
      {children}
    </DemoAppContext.Provider>
  );
}
