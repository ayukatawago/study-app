'use client';

import { useState, useEffect } from 'react';
import { PrefectureData, PrefectureQuestionData } from '@/types/flashcard';
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
  const [prefectureQuestions, setPrefectureQuestions] = useState<PrefectureQuestionData[]>([]);
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

        // Flatten all questions from all prefectures and add prefecture info
        const allQuestions: PrefectureQuestionData[] = [];

        data.prefectures?.forEach(prefecture => {
          prefecture.questions?.forEach(question => {
            // Create a unique identifier combining prefecture and question id
            const uniqueId = `${prefecture.prefecture}-${question.id || question.keyword}`;
            allQuestions.push({
              ...question,
              id: uniqueId,
              // Store prefecture info in the question for display
              prefecture: prefecture.prefecture,
            } as PrefectureQuestionData & { prefecture: string });
          });
        });

        setPrefectureQuestions(allQuestions);
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
