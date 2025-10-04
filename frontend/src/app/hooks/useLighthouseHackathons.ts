import { useState, useEffect, useCallback } from 'react';
import { Hackathon } from '../types';
import { getApiService, ApiService } from '../../lib/api-service';

export interface UseLighthouseHackathonsOptions {
  ipns?: string;
  autoFetch?: boolean;
}

export interface UseLighthouseHackathonsReturn {
  hackathons: Hackathon[];
  loading: boolean;
  error: string | null;
  createHackathon: (hackathon: Omit<Hackathon, 'id'>) => Promise<string>;
  updateHackathon: (id: string, hackathon: Hackathon) => Promise<void>;
  deleteHackathon: (id: string) => Promise<void>;
  getHackathonById: (id: string) => Promise<Hackathon | null>;
  getHackathonBySlug: (slug: string) => Promise<Hackathon | null>;
  refresh: () => Promise<void>;
}

export function useLighthouseHackathons({ 
  ipns, 
  autoFetch = true 
}: UseLighthouseHackathonsOptions): UseLighthouseHackathonsReturn {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service] = useState<ApiService>(() => getApiService());

  const fetchHackathons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.getAllHackathons(ipns);
      if (response.success && response.data) {
        setHackathons(response.data);
      } else {
        setError(response.error || 'Failed to fetch hackathons');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hackathons';
      setError(errorMessage);
      console.error('Error fetching hackathons:', err);
    } finally {
      setLoading(false);
    }
  }, [service, ipns]);

  const createHackathon = useCallback(async (hackathonData: Omit<Hackathon, 'id'>): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.createHackathon(hackathonData);
      if (response.success && response.data) {
        await fetchHackathons(); // Refresh the list
        return response.data.id;
      } else {
        throw new Error(response.error || 'Failed to create hackathon');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create hackathon';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchHackathons]);

  const updateHackathon = useCallback(async (id: string, hackathon: Hackathon): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.updateHackathon(id, hackathon);
      if (response.success) {
        await fetchHackathons(); // Refresh the list
      } else {
        throw new Error(response.error || 'Failed to update hackathon');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update hackathon';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchHackathons]);

  const deleteHackathon = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.deleteHackathon(id);
      if (response.success) {
        await fetchHackathons(); // Refresh the list
      } else {
        throw new Error(response.error || 'Failed to delete hackathon');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete hackathon';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchHackathons]);

  const getHackathonById = useCallback(async (id: string): Promise<Hackathon | null> => {
    try {
      const response = await service.getHackathonById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to get hackathon');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get hackathon';
      setError(errorMessage);
      return null;
    }
  }, [service]);

  const getHackathonBySlug = useCallback(async (slug: string): Promise<Hackathon | null> => {
    try {
      const response = await service.getHackathonBySlug(slug);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to get hackathon');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get hackathon';
      setError(errorMessage);
      return null;
    }
  }, [service]);

  const refresh = useCallback(async () => {
    await fetchHackathons();
  }, [fetchHackathons]);

  useEffect(() => {
    if (autoFetch) {
      fetchHackathons();
    }
  }, [autoFetch, fetchHackathons]);

  return {
    hackathons,
    loading,
    error,
    createHackathon,
    updateHackathon,
    deleteHackathon,
    getHackathonById,
    getHackathonBySlug,
    refresh
  };
}
