'use client';

import { useState, useEffect } from 'react';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useUnitedNations' });

export interface UnitedNationsItem {
  id: number;
  title: string;
  description: string[];
}

export interface UnitedNationsData {
  general: UnitedNationsItem[];
  agencies: UnitedNationsItem[];
  human_rights: UnitedNationsItem[];
  global_environment: UnitedNationsItem[];
}

/**
 * Custom hook to fetch and manage United Nations data
 *
 * @returns Object with United Nations data, loading state, and error state
 */
export function useUnitedNations() {
  const [unitedNationsData, setUnitedNationsData] = useState<UnitedNationsData>({
    general: [],
    agencies: [],
    human_rights: [],
    global_environment: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUnitedNations() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/civics/united_nations.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch United Nations data: ${response.statusText}`);
        }

        const data: UnitedNationsData = await response.json();
        setUnitedNationsData(
          data || {
            general: [],
            agencies: [],
            human_rights: [],
            global_environment: [],
          }
        );
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        logger.error(`Failed to fetch United Nations data: ${errorMessage}`, err);
        setError(errorMessage);
        setUnitedNationsData({
          general: [],
          agencies: [],
          human_rights: [],
          global_environment: [],
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUnitedNations();
  }, []);

  return { unitedNationsData, isLoading, error };
}
