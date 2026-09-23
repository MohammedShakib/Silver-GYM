import { useState, useEffect, useCallback } from 'react';
import { membershipService } from '../services/MembershipService';
import { useCurrentMember } from './useCurrentMember';

export function useMembership() {
  const [membership, setMembership] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { member } = useCurrentMember();

  const refetch = useCallback(async () => {
    if (!member) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const [memData, plansData] = await Promise.all([
        membershipService.getCurrentMembership(),
        membershipService.getPlans()
      ]);
      setMembership(memData);
      setPlans(plansData);
    } catch (err) {
      console.error('Membership fetch error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [member]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { 
    membership, 
    plans, 
    isLoading, 
    error, 
    refetch
  };
}
