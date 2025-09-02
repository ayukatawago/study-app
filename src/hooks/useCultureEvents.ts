'use client';

import { useState, useEffect } from 'react';
import { CultureEventData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useCultureEvents' });

interface CultureData {
  culture: CultureEventData[];
  figures: CultureEventData[];
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
        // Combine culture and figures arrays, ensuring each event has proper id
        const cultureItems: CultureEventData[] = (data.culture || []).map(event => ({
          ...event,
          id: typeof event.id === 'number' ? event.id : 0, // Ensure id is a number
          type: 'culture' as const,
        }));

        const figureItems: CultureEventData[] = (data.figures || []).map(event => ({
          ...event,
          id: typeof event.id === 'number' ? event.id : 0, // Ensure id is a number
          type: 'figures' as const,
        }));

        const allEvents = [...cultureItems, ...figureItems];
        setCultureEvents(allEvents);
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
