'use client';

import { useState, useEffect } from 'react';
import { PrefectureData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'usePrefectures' });

interface PrefecturesData {
  prefectures: PrefectureData[];
}

/**
 * Custom hook to fetch and manage prefecture data
 *
 * @returns Object with prefecture questions, loading state, and error state
 */
export function usePrefectures() {
  const [prefectureQuestions, setPrefectureQuestions] = useState<PrefectureData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrefectures() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/geography/prefectures.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch prefecture data: ${response.statusText}`);
        }

        const data: PrefecturesData = await response.json();

        // Data is already flattened, just use it directly
        setPrefectureQuestions(data.prefectures || []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch prefecture data: ${errorMessage}`, err);
        setError(errorMessage);
        setPrefectureQuestions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrefectures();
  }, []);

  return { prefectureQuestions, isLoading, error };
}
