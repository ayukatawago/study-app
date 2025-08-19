'use client';

import { useState, useEffect } from 'react';
import { HumanQuizData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useHumanQuiz' });

interface HumanQuizSource {
  human: HumanQuizData[];
}

/**
 * Custom hook to fetch and manage human quiz data
 *
 * @returns Object with human quiz data, loading state, and error state
 */
export function useHumanQuiz() {
  const [humanQuizData, setHumanQuizData] = useState<HumanQuizData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHumanQuizData() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/science/human.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch human quiz data: ${response.statusText}`);
        }

        const data: HumanQuizSource = await response.json();

        setHumanQuizData(data.human || []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch human quiz data: ${errorMessage}`, err);
        setError(errorMessage);
        setHumanQuizData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHumanQuizData();
  }, []);

  return { humanQuizData, isLoading, error };
}
