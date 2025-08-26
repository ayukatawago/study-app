'use client';

import { useState, useEffect } from 'react';
import { CraftData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useCrafts' });

interface CraftsData {
  traditional_crafts: CraftData[];
}

/**
 * Custom hook to fetch and manage traditional craft data
 *
 * @returns Object with craft questions, loading state, and error state
 */
export function useCrafts() {
  const [craftQuestions, setCraftQuestions] = useState<CraftData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCrafts() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/geography/crafts.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch craft data: ${response.statusText}`);
        }

        const data: CraftsData = await response.json();

        setCraftQuestions(data.traditional_crafts || []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch craft data: ${errorMessage}`, err);
        setError(errorMessage);
        setCraftQuestions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCrafts();
  }, []);

  return { craftQuestions, isLoading, error };
}
