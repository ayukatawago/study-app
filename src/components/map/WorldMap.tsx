'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useCountryPosition } from '@/hooks/useCountryPosition';
import { ZoomControls } from './ZoomControls';
import { LoadingIndicator } from './LoadingIndicator';

// Dynamically import the LeafletMap component to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface WorldMapProps {
  highlightedCountry?: string; // ISO Alpha-2 or Alpha-3 country code
  width?: number;
  height?: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ highlightedCountry, width, height }) => {
  const { position, isZoomed, isTransitioning, countryPosition, handleZoomIn, handleZoomOut } =
    useCountryPosition(highlightedCountry);

  // Calculate responsive dimensions with 4:3 aspect ratio
  const mapAspectRatio = 4 / 3;
  const containerMaxWidth = 320;
  const containerMaxHeight = 240;

  // Use provided dimensions or calculate responsive ones
  const mapWidth = width || containerMaxWidth;
  const mapHeight = height || containerMaxHeight;

  return (
    <div
      className={`world-map-container relative ${isTransitioning ? 'transition-opacity' : ''}`}
      style={{
        width: '100%',
        maxWidth: `${mapWidth}px`,
        aspectRatio: `${mapAspectRatio}`,
        height: 'auto',
        maxHeight: `${mapHeight}px`,
        padding: 0,
        margin: '0 auto',
        transition: 'all 0.5s ease-in-out',
        overflow: 'visible',
      }}
    >
      <ZoomControls
        showZoomIn={countryPosition !== null && !isZoomed}
        showZoomOut={isZoomed}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <LoadingIndicator isVisible={isTransitioning} />

      <LeafletMap
        highlightedCountry={highlightedCountry}
        position={position}
        isTransitioning={isTransitioning}
        width={mapWidth}
        height={mapHeight}
      />
    </div>
  );
};

export default WorldMap;
