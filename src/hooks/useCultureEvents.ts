'use client';

import { useState, useEffect } from 'react';
import { CultureEventData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useCultureEvents' });

interface CultureData {
  culture: CultureEventData[];
}

/**
 * Custom hook to fetch and manage culture events
 *
 * @returns Object with culture events, loading state, and error state
 */
export function useCultureEvents() {
  const [cultureEvents, setCultureEvents] = useState<CultureEventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCultureEvents() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/history/culture.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch culture events: ${response.statusText}`);
        }

        const data: CultureData = await response.json();
        // Map to ensure each event has an id
        const eventsWithId = (data.culture || []).map(event => ({
          ...event,
          id: event.person, // Use person name as id
        }));
        setCultureEvents(eventsWithId);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch culture events: ${errorMessage}`, err);
        setError(errorMessage);
        setCultureEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCultureEvents();
  }, []);

  return { cultureEvents, isLoading, error };
}
