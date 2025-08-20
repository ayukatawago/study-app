import centroid from '@turf/centroid';
import { feature } from 'topojson-client';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'countryUtils' });

export interface CountryPosition {
  coordinates: [number, number];
  bbox?: number[];
}

export interface CountryData {
  countries: Array<{
    countryCode: string;
    countryName: string;
    capitalCity: string;
    descriptions: string[];
    isoCode: string;
    zoomLevel: number;
  }>;
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

export const flattenCoordinates = (arr: any[]): [number, number][] => {
  return arr.reduce(
    (acc: [number, number][], val: any) =>
      Array.isArray(val[0])
        ? acc.concat(flattenCoordinates(val))
        : acc.concat([val as [number, number]]),
    [] as [number, number][]
  );
};

export const calculateBoundingBox = (coordinates: any[]): number[] | undefined => {
  try {
    const points = flattenCoordinates(coordinates);

    if (points.length === 0) return undefined;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const [x, y] of points) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return [minX, minY, maxX, maxY];
  } catch (e) {
    logger.debug('Failed to calculate bbox from coordinates', e);
    return undefined;
  }
};

export const findCountryPosition = async (
  highlightedCountry: string,
  countryData: CountryData | null
): Promise<CountryPosition | null> => {
  if (!highlightedCountry || !countryData) {
    return null;
  }

  try {
    const response = await fetch(geoUrl);
    const topojsonData = await response.json();

    const countryId = highlightedCountry;

    if (topojsonData?.objects?.countries) {
      const countryGeom = topojsonData.objects.countries.geometries.find(
        (g: any) => String(g.id) === countryId
      );

      if (countryGeom) {
        const countryFeature = feature(topojsonData, countryGeom);
        const countryCentroid = centroid(countryFeature);
        const centerCoords = countryCentroid.geometry.coordinates;

        let bbox: number[] | undefined;
        if (countryGeom.bbox) {
          bbox = countryGeom.bbox as number[];
        } else {
          const coords = countryFeature.geometry.coordinates;
          if (coords && coords.length > 0) {
            bbox = calculateBoundingBox(coords);
          }
        }

        return {
          coordinates: [centerCoords[0], centerCoords[1]] as [number, number],
          bbox: bbox,
        };
      }
    }

    return null;
  } catch (err) {
    logger.debug('Failed to find country position', err);
    return null;
  }
};

export const getCountryZoomLevel = (
  countryCode: string,
  countryData: CountryData | null
): number | null => {
  if (!countryData?.countries) return null;

  const countryInfo = countryData.countries.find(c => c.countryCode === countryCode);

  return countryInfo?.zoomLevel || null;
};
