'use client';

import { useState, useEffect } from 'react';
import { AnimalQuizData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useAnimalQuiz' });

interface AnimalQuizSource {
  animal_1: AnimalQuizData[];
  animal_2: AnimalQuizData[];
}

/**
 * Custom hook to fetch and manage animal quiz data
 *
 * @returns Object with animal quiz data, loading state, and error state
 */
export function useAnimalQuiz(category: 'animal_1' | 'animal_2' | 'all' = 'all') {
  const [animalQuizData, setAnimalQuizData] = useState<AnimalQuizData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnimalQuizData() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/science/animals.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch animal quiz data: ${response.statusText}`);
        }

        const data: AnimalQuizSource = await response.json();

        let combinedData: AnimalQuizData[] = [];

        // Filter data based on the selected category
        if (category === 'animal_1' || category === 'all') {
          combinedData = [...combinedData, ...(data.animal_1 || [])];
        }

        if (category === 'animal_2' || category === 'all') {
          combinedData = [...combinedData, ...(data.animal_2 || [])];
        }

        setAnimalQuizData(combinedData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch animal quiz data: ${errorMessage}`, err);
        setError(errorMessage);
        setAnimalQuizData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnimalQuizData();
  }, [category]);

  return { animalQuizData, isLoading, error };
}
