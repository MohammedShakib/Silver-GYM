import { useState, useEffect, useCallback } from 'react';
import { gymService } from '../services/GymService';

export function useGyms(filters = {}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stringify filters so we can use it in dependency array without triggering infinite loops
  const filterKey = JSON.stringify(filters);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await gymService.getGyms(filters);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
