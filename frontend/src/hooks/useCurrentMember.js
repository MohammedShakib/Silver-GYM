import { useState, useEffect, useCallback } from 'react';
import { memberService } from '../services/MemberService';
import { storage } from '../data/storage/StorageAdapter';

export function useCurrentMember() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // In a real app, userId comes from AuthContext. For demo, we use the storage initialized ID.
  const userId = storage.get('demoUserId');

  const refetch = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await memberService.getCurrentMember(userId);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateProfile = async (updates) => {
    const updated = await memberService.updateProfile(userId, updates);
    setData(updated);
    return updated;
  };

  const updatePreferences = async (prefs) => {
    const updated = await memberService.updatePreferences(userId, prefs);
    setData(updated);
    return updated;
  };

  return { 
    member: data, 
    isLoading, 
    error, 
    refetch,
    updateProfile,
    updatePreferences
  };
}
