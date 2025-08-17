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
  // Track zoom transition state
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [countryPosition, setCountryPosition] = React.useState<{
    coordinates: [number, number];
    bbox?: number[];
  } | null>(null);

  // Ref to track animation frames for smoother transitions
  const animationRef = React.useRef<number | null>(null);
  // Ref to track animation start time
  const animationStartRef = React.useRef<number>(0);
  // Ref to track animation target values
  const animationTargetRef = React.useRef<{ coordinates: [number, number]; zoom: number } | null>(
    null
  );

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

  // Use refs to access position values without creating dependency cycles
  const positionRef = React.useRef<{ coordinates: [number, number]; zoom: number }>(position);

  // Keep the ref updated with latest position
  React.useEffect(() => {
    positionRef.current = position;
  }, [position]);

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
                // Use ref to access current position without creating dependency
                const currentCoords = positionRef.current.coordinates;
                const currentZoom = positionRef.current.zoom;

                // Target position
                const targetCoords = newPosition.coordinates;

                // Animate to the target position
                animateToPosition(currentCoords, targetCoords, currentZoom, zoomLevel, () =>
                  setIsZoomed(true)
                );
              }, 200);
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

  // Helper function for smooth animation between zoom levels
  const animateToPosition = (
    startCoords: [number, number],
    endCoords: [number, number],
    startZoom: number,
    endZoom: number,
    onComplete?: () => void
  ) => {
    // Mark as transitioning
    setIsTransitioning(true);

    const steps = 10; // More steps for smoother animation
    let currentStep = 0;
    const stepDuration = 50; // Faster steps for a total of 500ms animation

    const animateStep = () => {
      currentStep++;
      const progress = currentStep / steps;

      // Calculate intermediate position using cubic easing for more natural motion
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      // Calculate intermediate coordinates and zoom
      const nextX = startCoords[0] + (endCoords[0] - startCoords[0]) * easedProgress;
      const nextY = startCoords[1] + (endCoords[1] - startCoords[1]) * easedProgress;
      const nextZoom = startZoom + (endZoom - startZoom) * easedProgress;

      // Update position
      setPosition({
        coordinates: [nextX, nextY],
        zoom: nextZoom,
      });

      // Continue animation or complete
      if (currentStep < steps) {
        setTimeout(animateStep, stepDuration);
      } else {
        // Final position - ensure we end exactly at the target
        setPosition({
          coordinates: endCoords,
          zoom: endZoom,
        });

        // End transition after a short delay
        setTimeout(() => {
          setIsTransitioning(false);
          if (onComplete) onComplete();
        }, 100);
      }
    };

    // Start animation
    requestAnimationFrame(() => animateStep());
  };

  // Function to zoom in to the target country with animation
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
        // Get current position
        const currentCoords = position.coordinates;
        const currentZoom = position.zoom;

        // Target position
        const targetCoords = countryPosition.coordinates;
        const targetZoom = countryInfo.zoomLevel;

        // Animate to the target position
        animateToPosition(currentCoords, targetCoords, currentZoom, targetZoom, () =>
          setIsZoomed(true)
        );
      }
    }
  };

  // Function to reset zoom with animation
  const handleZoomOut = (e: React.MouseEvent) => {
    // Stop event propagation to prevent card flip
    e.stopPropagation();

    // Get current position
    const currentCoords = position.coordinates;
    const currentZoom = position.zoom;

    // World view position
    const worldCoords: [number, number] = [0, 0];
    const worldZoom = 1;

    // Animate to world view
    animateToPosition(currentCoords, worldCoords, currentZoom, worldZoom, () => setIsZoomed(false));
  };

  return (
    <div
      className={`world-map-container relative ${isTransitioning ? 'transition-opacity' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <div className="absolute top-2 right-2 z-10 flex space-x-1">
        {countryPosition && !isZoomed && (
          <button
            className="p-1.5 rounded-full bg-white shadow-md hover:bg-blue-100 active:bg-blue-200 transition-all duration-300 text-blue-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleZoomIn}
            title="Zoom to country"
            aria-label="Zoom in to country"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            className="p-1.5 rounded-full bg-white shadow-md hover:bg-blue-100 active:bg-blue-200 transition-all duration-300 text-blue-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom out to world view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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

      {/* Add a visual feedback during transitions */}
      {isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-blue-200 bg-opacity-20 animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-300 bg-opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400 bg-opacity-40"></div>
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 120,
          rotate: [0, 0, 0],
        }}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          margin: 0,
          padding: 0,
          filter: isTransitioning ? 'brightness(1.05)' : 'none',
          transition: 'filter 0.3s ease-in-out',
        }}
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
          // Add smooth animation for zoom transitions
          transitionDuration={800}
          transitionEase="easeQuadOut"
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
