import { useState, useEffect } from 'react';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'useCountryData' });

interface CountryInfo {
  countryCode: string;
  countryName: string;
  capitalCity: string;
  descriptions: string[];
  isoCode: string;
  zoomLevel: number;
}

interface CountryData {
  countries: CountryInfo[];
}

export const useCountryData = () => {
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function loadCountryData() {
      if (dataLoaded) return;

      try {
        const response = await fetch('/data/world_countries.json');
        const data = await response.json();
        setCountryData(data);
        setDataLoaded(true);
      } catch (err) {
        logger.debug('Failed to load country data', err);
      }
    }

    loadCountryData();
  }, [dataLoaded]);

  return { countryData, dataLoaded };
};
