import { useState, useEffect, useCallback } from 'react';
import { Recording } from '../types';
import { apiClient } from '../lib/api/client';

export function useRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  const loadRecordings = useCallback(async (reset = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getRecordings(20, reset ? undefined : cursor);
      
      if (reset) {
        setRecordings(response.items);
      } else {
        setRecordings(prev => [...prev, ...response.items]);
      }
      
      setCursor(response.nextCursor);
      setHasMore(!!response.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recordings');
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading]);

  const addRecording = (recording: Recording) => {
    setRecordings(prev => [recording, ...prev]);
  };

  const updateRecording = (id: string, updates: Partial<Recording>) => {
    setRecordings(prev => 
      prev.map(recording => 
        recording.id === id ? { ...recording, ...updates } : recording
      )
    );
  };

  useEffect(() => {
    loadRecordings(true);
  }, []);

  return {
    recordings,
    isLoading,
    error,
    hasMore,
    loadMore: () => loadRecordings(false),
    refresh: () => loadRecordings(true),
    addRecording,
    updateRecording
  };
}