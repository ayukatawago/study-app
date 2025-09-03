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

const WorldMap: React.FC<WorldMapProps> = ({ highlightedCountry, width = 800, height = 300 }) => {
  const { position, isZoomed, isTransitioning, countryPosition, handleZoomIn, handleZoomOut } =
    useCountryPosition(highlightedCountry);

  return (
    <div
      className={`world-map-container relative ${isTransitioning ? 'transition-opacity' : ''}`}
      style={{
        width: '100%',
        height: `${height}px`,
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

      <LeafletMap
        highlightedCountry={highlightedCountry}
        position={position}
        isTransitioning={isTransitioning}
        height={height}
      />
    </div>
  );
};

export default WorldMap;
