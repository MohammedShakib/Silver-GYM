import { useState, useEffect, useCallback } from 'react';
import { gymService } from '../services/GymService';

export function useGym(gymId) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!gymId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await gymService.getGym(gymId);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [gymId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { gym: data, isLoading, error, refetch };
}
