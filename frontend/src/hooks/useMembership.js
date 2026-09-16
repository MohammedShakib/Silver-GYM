import { useState, useEffect, useCallback } from 'react';
import { membershipService } from '../services/MembershipService';
import { storage } from '../data/storage/StorageAdapter';

export function useMembership() {
  const [membership, setMembership] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = storage.get('demoUserId');

  const refetch = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [memData, plansData] = await Promise.all([
        membershipService.getCurrentMembership(userId),
        membershipService.getPlans()
      ]);
      setMembership(memData);
      setPlans(plansData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const activatePlan = async (planId) => {
    setIsLoading(true);
    try {
      const updated = await membershipService.activatePlan(userId, planId);
      setMembership(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    membership, 
    plans, 
    isLoading, 
    error, 
    refetch,
    activatePlan 
  };
}
