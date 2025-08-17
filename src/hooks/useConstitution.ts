'use client';

import { useState, useEffect } from 'react';

export interface ConstitutionArticle {
  article: number;
  summary?: string;
  paragraphs: string[];
}

export interface ConstitutionSection {
  section: number;
  title: string;
  articles: ConstitutionArticle[];
}

interface ConstitutionData {
  constitution: {
    title: string;
    sections: ConstitutionSection[];
  };
}

/**
 * Custom hook to fetch and manage constitution articles
 *
 * @returns Object with constitution data, loading state, and error state
 */
export function useConstitution() {
  const [constitutionData, setConstitutionData] = useState<{
    title: string;
    sections: ConstitutionSection[];
  }>({ title: '', sections: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConstitution() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/constitution.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch constitution data: ${response.statusText}`);
        }

        const data: ConstitutionData = await response.json();
        setConstitutionData(data.constitution || { title: '', sections: [] });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        setConstitutionData({ title: '', sections: [] });
      } finally {
        setIsLoading(false);
      }
    }

    fetchConstitution();
  }, []);

  return { constitutionData, isLoading, error };
}
