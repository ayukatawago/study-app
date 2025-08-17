'use client';

import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import centroid from '@turf/centroid';
import { feature } from 'topojson-client';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'WorldMap' });

// World map JSON data - use jsdelivr CDN source
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

interface WorldMapProps {
  highlightedCountry?: string; // ISO Alpha-2 or Alpha-3 country code
  width?: number;
  height?: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ highlightedCountry, width = 800, height = 300 }) => {
  // Map position state
  const [position, setPosition] = React.useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 0],
    zoom: 1,
  });
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [countryPosition, setCountryPosition] = React.useState<{
    coordinates: [number, number];
    bbox?: number[];
  } | null>(null);

  // Load country data from JSON
  const [countryData, setCountryData] = React.useState<any>(null);
  const [dataLoaded, setDataLoaded] = React.useState(false);

  // Fetch country data on initial load
  React.useEffect(() => {
    async function loadCountryData() {
      if (dataLoaded) return; // Don't load multiple times

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

  // Find the highlighted country's position in the TopoJSON data
  const findCountryPosition = React.useCallback(async () => {
    if (!highlightedCountry || !countryData || !dataLoaded) {
      return;
    }

    try {
      // Load the topology data
      const response = await fetch(geoUrl);
      const topojsonData = await response.json();

      // Use the country ID as is (string)
      const countryId = highlightedCountry;

      if (topojsonData?.objects?.countries) {
        // Find the country in the TopoJSON geometries
        const countryGeom = topojsonData.objects.countries.geometries.find(
          (g: any) => String(g.id) === countryId
        );

        if (countryGeom) {
          // Extract the country as a GeoJSON feature
          const countryFeature = feature(topojsonData, countryGeom);

          // Calculate centroid using turf
          const countryCentroid = centroid(countryFeature);
          const centerCoords = countryCentroid.geometry.coordinates;

          // Get the bounding box if available
          let bbox: number[] | undefined;
          if (countryGeom.bbox) {
            bbox = countryGeom.bbox as number[];
          } else {
            // If there's no bbox, calculate one from the geometry
            try {
              // Get coordinates from the feature
              const coords = countryFeature.geometry.coordinates;
              if (coords && coords.length > 0) {
                // Flatten nested arrays to get all coordinate points
                const flattenCoords = (arr: any[]): [number, number][] => {
                  return arr.reduce(
                    (acc: [number, number][], val: any) =>
                      Array.isArray(val[0])
                        ? acc.concat(flattenCoords(val))
                        : acc.concat([val as [number, number]]),
                    [] as [number, number][]
                  );
                };

                // Try to flatten the coordinates to extract min/max
                const points = flattenCoords(coords);

                if (points.length > 0) {
                  // Find min and max values
                  let minX = Infinity,
                    minY = Infinity,
                    maxX = -Infinity,
                    maxY = -Infinity;

                  for (const [x, y] of points) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                  }

                  bbox = [minX, minY, maxX, maxY];
                }
              }
            } catch (e) {
              logger.debug('Failed to calculate bbox from coordinates', e);
            }
          }

          // Create position object for state and zooming
          const newPosition = {
            coordinates: [centerCoords[0], centerCoords[1]] as [number, number],
            bbox: bbox,
          };

          // Update country position state
          setCountryPosition(newPosition);

          // Get zoom level from JSON data
          if (countryData.countries) {
            // Find the country in the JSON data
            const countryInfo = countryData.countries.find((c: any) => c.countryCode === countryId);

            if (countryInfo?.zoomLevel) {
              const zoomLevel = countryInfo.zoomLevel;

              // Small delay to let the UI update first
              setTimeout(() => {
                setPosition({
                  coordinates: newPosition.coordinates,
                  zoom: zoomLevel,
                });
                setIsZoomed(true);
              }, 100);
            }
          }
          return;
        }
      }

      setCountryPosition(null);
    } catch (err) {
      logger.debug('Failed to find country position', err);
      setCountryPosition(null);
    }
  }, [highlightedCountry, countryData, dataLoaded]);

  // When highlighted country changes or data loads, find its position
  React.useEffect(() => {
    if (highlightedCountry && dataLoaded) {
      findCountryPosition();
    } else if (!highlightedCountry) {
      // Reset when no country is highlighted
      setPosition({ coordinates: [0, 0] as [number, number], zoom: 1 });
      setIsZoomed(false);
      setCountryPosition(null);
    }
  }, [highlightedCountry, findCountryPosition, dataLoaded]);

  // Function to zoom in to the target country
  const handleZoomIn = (e: React.MouseEvent) => {
    // Stop event propagation to prevent card flip
    e.stopPropagation();

    if (!countryPosition || !countryData || !highlightedCountry) {
      return;
    }

    // Get zoom level from JSON data
    if (countryData.countries) {
      // Find the country in the JSON data
      const countryInfo = countryData.countries.find(
        (c: any) => c.countryCode === highlightedCountry
      );

      if (countryInfo?.zoomLevel) {
        setPosition({
          coordinates: countryPosition.coordinates,
          zoom: countryInfo.zoomLevel,
        });
        setIsZoomed(true);
      }
    }
  };

  // Function to reset zoom
  const handleZoomOut = (e: React.MouseEvent) => {
    // Stop event propagation to prevent card flip
    e.stopPropagation();

    setPosition({ coordinates: [0, 0] as [number, number], zoom: 1 });
    setIsZoomed(false);
  };

  return (
    <div
      className="world-map-container relative"
      style={{ width: '100%', height: '100%', padding: 0, margin: 0 }}
    >
      <div className="absolute top-0 right-0 z-10 flex space-x-1">
        {countryPosition && !isZoomed && (
          <button
            className="p-1 rounded-full bg-white/80 hover:bg-blue-100 active:bg-blue-200 transition-all duration-150 text-blue-600"
            onClick={handleZoomIn}
            title="Zoom to country"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3a1 1 0 012 0v5.5h5.5a1 1 0 110 2H11V16a1 1 0 11-2 0v-5.5H3.5a1 1 0 110-2H9V3z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {isZoomed && (
          <button
            className="p-1 rounded-full bg-white/80 hover:bg-blue-100 active:bg-blue-200 transition-all duration-150 text-blue-600"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 160,
          rotate: [0, 0, 0],
        }}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', display: 'block', margin: 0, padding: 0 }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          maxZoom={20}
          translateExtent={[
            [-width, -height / 2],
            [width, height / 2],
          ]}
          onMoveEnd={({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) =>
            setPosition({ coordinates, zoom })
          }
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                // Convert both to strings for comparison
                const geoId = String(geo.id);
                const targetId = String(highlightedCountry);

                // Determine if this country should be highlighted
                const isHighlighted = highlightedCountry !== undefined && geoId === targetId;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? '#FF0000' : '#D6D6DA'}
                    style={{
                      default: {
                        fill: isHighlighted ? '#FF0000' : '#D6D6DA',
                        outline: 'none',
                      },
                      hover: {
                        fill: isHighlighted ? '#FF4500' : '#A9A9A9',
                        outline: 'none',
                      },
                      pressed: {
                        fill: isHighlighted ? '#E9967A' : '#C0C0C0',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
