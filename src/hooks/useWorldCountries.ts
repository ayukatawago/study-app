'use client';

import { useState, useEffect } from 'react';
import { WorldCountryData } from '@/types/flashcard';

interface WorldCountriesData {
  countries: Omit<WorldCountryData, 'id'>[];
}

/**
 * Custom hook to fetch and manage world country data
 * 
 * @returns Object with world countries, loading state, and error state
 */
export function useWorldCountries() {
  const [worldCountries, setWorldCountries] = useState<WorldCountryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorldCountries() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/world_countries.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch world countries: ${response.statusText}`);
        }
        
        const data: WorldCountriesData = await response.json();
        // Map to ensure each country has an id
        const countriesWithId = (data.countries || []).map(country => ({
          ...country,
          id: country.countryCode // Use country code as id
        }));
        setWorldCountries(countriesWithId);
        setError(null);
      } catch (err) {
        console.error('Error fetching world countries:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        setWorldCountries([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorldCountries();
  }, []);

  return { worldCountries, isLoading, error };
}