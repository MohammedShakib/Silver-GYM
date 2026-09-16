import { useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/ActivityService';
import { storage } from '../data/storage/StorageAdapter';

export function useActivity() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = storage.get('demoUserId');

  const refetch = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await activityService.getActivity(userId);
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

  return { 
    activity: data, 
    isLoading, 
    error, 
    refetch 
  };
}
