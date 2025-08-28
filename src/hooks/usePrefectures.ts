'use client';

import { useState, useEffect } from 'react';
import { PrefectureData, RankingData, CitiesData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'usePrefectures' });

interface PrefecturesData {
  prefectures: PrefectureData[];
  ranking: RankingData[];
  cities: CitiesData[];
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

        // Combine all data types into a single array with proper formatting
        const allQuestions: PrefectureData[] = [];

        // Add prefecture questions
        if (data.prefectures) {
          allQuestions.push(...data.prefectures);
        }

        // Add ranking data converted to PrefectureData format
        if (data.ranking) {
          data.ranking.forEach(ranking => {
            allQuestions.push({
              id: ranking.id + 1000, // Offset to avoid ID conflicts
              prefecture: 'ランキング',
              keyword: ranking.keyword,
              answer: ranking.answer,
            });
          });
        }

        // Add cities data converted to PrefectureData format
        if (data.cities) {
          data.cities.forEach(cities => {
            allQuestions.push({
              id: cities.id + 2000, // Offset to avoid ID conflicts
              prefecture: '都市',
              keyword: cities.keyword,
              answer: cities.answer,
            });
          });
        }

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
