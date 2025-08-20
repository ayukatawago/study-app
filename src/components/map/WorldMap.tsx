'use client';

import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useCountryPosition } from '@/hooks/useCountryPosition';
import { ZoomControls } from './ZoomControls';
import { LoadingIndicator } from './LoadingIndicator';

// World map JSON data - use jsdelivr CDN source
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

interface WorldMapProps {
  highlightedCountry?: string; // ISO Alpha-2 or Alpha-3 country code
  width?: number;
  height?: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ highlightedCountry, width = 800, height = 300 }) => {
  const {
    position,
    setPosition,
    isZoomed,
    isTransitioning,
    countryPosition,
    handleZoomIn,
    handleZoomOut,
  } = useCountryPosition(highlightedCountry);

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
      <ZoomControls
        showZoomIn={countryPosition !== null && !isZoomed}
        showZoomOut={isZoomed}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <LoadingIndicator isVisible={isTransitioning} />

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
