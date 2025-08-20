'use client';

import { useState, useEffect } from 'react';
import { HistoryEventData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useHistoryEvents' });

interface HistoryData {
  history: HistoryEventData[];
}

/**
 * Custom hook to fetch and manage history events
 *
 * @returns Object with history events, loading state, and error state
 */
export function useHistoryEvents() {
  const [historyEvents, setHistoryEvents] = useState<HistoryEventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistoryEvents() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/history/events.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch history events: ${response.statusText}`);
        }

        const data: HistoryData = await response.json();
        // Map to ensure each event has an id
        const eventsWithId = (data.history || []).map(event => ({
          ...event,
          id: event.year, // Use year as id
        }));
        setHistoryEvents(eventsWithId);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch history events: ${errorMessage}`, err);
        setError(errorMessage);
        setHistoryEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoryEvents();
  }, []);

  return { historyEvents, isLoading, error };
}
