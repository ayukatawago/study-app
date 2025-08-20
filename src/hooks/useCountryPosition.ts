import { useEffect, useCallback } from 'react';
import { useCountryData } from './useCountryData';
import { useMapPosition } from './useMapPosition';
import { findCountryPosition, getCountryZoomLevel } from '@/utils/countryUtils';

export const useCountryPosition = (highlightedCountry?: string) => {
  const { countryData, dataLoaded } = useCountryData();
  const mapPosition = useMapPosition();
  const { resetPosition, setCountryPosition, zoomToCountry } = mapPosition;

  const findAndZoomToCountry = useCallback(async () => {
    if (!highlightedCountry || !countryData || !dataLoaded) {
      return;
    }

    const position = await findCountryPosition(highlightedCountry, countryData);
    if (position) {
      setCountryPosition(position);

      const zoomLevel = getCountryZoomLevel(highlightedCountry, countryData);
      if (zoomLevel) {
        setTimeout(() => {
          zoomToCountry(position, zoomLevel);
        }, 200);
      }
    } else {
      setCountryPosition(null);
    }
  }, [highlightedCountry, countryData, dataLoaded, setCountryPosition, zoomToCountry]);

  useEffect(() => {
    if (highlightedCountry && dataLoaded) {
      findAndZoomToCountry();
    } else if (!highlightedCountry) {
      resetPosition();
    }
  }, [highlightedCountry, dataLoaded, findAndZoomToCountry, resetPosition]);

  const handleZoomIn = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!mapPosition.countryPosition || !countryData || !highlightedCountry) {
        return;
      }

      const zoomLevel = getCountryZoomLevel(highlightedCountry, countryData);
      if (zoomLevel) {
        mapPosition.zoomToCountry(mapPosition.countryPosition, zoomLevel);
      }
    },
    [mapPosition, countryData, highlightedCountry]
  );

  const handleZoomOut = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      mapPosition.zoomToWorld();
    },
    [mapPosition]
  );

  return {
    ...mapPosition,
    countryData,
    dataLoaded,
    handleZoomIn,
    handleZoomOut,
  };
};
