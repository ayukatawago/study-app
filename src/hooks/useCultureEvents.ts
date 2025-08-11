'use client';

import { useState, useEffect } from 'react';
import { CultureEvent } from '@/components/flashcard/CultureFlashcard';

interface CultureData {
  culture: CultureEvent[];
}

/**
 * Custom hook to fetch and manage culture events
 * 
 * @returns Object with culture events, loading state, and error state
 */
export function useCultureEvents() {
  const [cultureEvents, setCultureEvents] = useState<CultureEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCultureEvents() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/history_culture.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch culture events: ${response.statusText}`);
        }
        
        const data: CultureData = await response.json();
        setCultureEvents(data.culture || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching culture events:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        setCultureEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCultureEvents();
  }, []);

  return { cultureEvents, isLoading, error };
}