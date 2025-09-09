'use client';

import { useState, useEffect } from 'react';
import { createLogger } from '@/utils/logger';
import { BaseFlashcardSettings } from '@/types/flashcard';

const logger = createLogger({ prefix: 'usePolitics' });

export interface PoliticsItem {
  id: number;
  keyword: string;
  description: string[];
  memo?: string;
}

export interface PoliticsSettings extends BaseFlashcardSettings {
  category: 'all' | 'diet' | 'cabinet' | 'court';
}

interface PoliticsData {
  diet: PoliticsItem[];
  cabinet: PoliticsItem[];
  court: PoliticsItem[];
}

/**
 * Custom hook to fetch and manage politics data
 *
 * @returns Object with politics data, loading state, and error state
 */
export function usePolitics() {
  const [politicsData, setPoliticsData] = useState<PoliticsData>({
    diet: [],
    cabinet: [],
    court: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolitics() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/civics/politics.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch politics data: ${response.statusText}`);
        }

        const data: PoliticsData = await response.json();
        setPoliticsData(data || { diet: [], cabinet: [], court: [] });
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch politics data: ${errorMessage}`, err);
        setError(errorMessage);
        setPoliticsData({ diet: [], cabinet: [], court: [] });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPolitics();
  }, []);

  return { politicsData, isLoading, error };
}
