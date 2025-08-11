'use client';

import { useState, useEffect } from 'react';
import { HistoryEvent } from '@/components/flashcard/Flashcard';

interface HistoryData {
  history: HistoryEvent[];
}

/**
 * Custom hook to fetch and manage history events
 * 
 * @returns Object with history events, loading state, and error state
 */
export function useHistoryEvents() {
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistoryEvents() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/history_events.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch history events: ${response.statusText}`);
        }
        
        const data: HistoryData = await response.json();
        setHistoryEvents(data.history || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching history events:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        setHistoryEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoryEvents();
  }, []);

  return { historyEvents, isLoading, error };
}