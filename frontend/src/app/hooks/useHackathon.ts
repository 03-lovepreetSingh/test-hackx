import { useState, useEffect } from 'react';
import { Hackathon } from '../types';
import { getApiService } from '../../lib/api-service';

export function useHackathon(hackathonId?: string) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiService = getApiService();

  useEffect(() => {
    if (!hackathonId) return;
    
    const fetchHackathon = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.getHackathonById(hackathonId);
        if (response.success && response.data) {
          setHackathon(response.data);
        } else {
          setError(response.error || 'Failed to fetch hackathon');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hackathon';
        setError(errorMessage);
        console.error('Failed to fetch hackathon:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHackathon();
  }, [hackathonId, apiService]);

  return { hackathon, loading, error };
}