'use client';

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';

// World map JSON data - use jsdelivr CDN source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  highlightedCountry?: string; // ISO Alpha-2 or Alpha-3 country code
  width?: number;
  height?: number;
}

const WorldMap: React.FC<WorldMapProps> = ({
  highlightedCountry,
  width = 800,
  height = 400
}) => {
  // Component initialization

  return (
    <div className="world-map-container" style={{ width: '100%', height: '100%' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 43,
          rotate: [0, 0, 0],
          center: [0, 25]
        }}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', display: 'block', margin: '0 auto' }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
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
                    fill={isHighlighted ? "#FF0000" : "#D6D6DA"}
                    stroke={isHighlighted ? "#000000" : "#FFFFFF"}
                    strokeWidth={isHighlighted ? 1 : 0.5}
                    style={{
                      default: {
                        fill: isHighlighted ? "#FF0000" : "#D6D6DA",
                        outline: "none",
                        stroke: isHighlighted ? "#000000" : "#FFFFFF",
                        strokeWidth: isHighlighted ? 1 : 0.5,
                      },
                      hover: {
                        fill: isHighlighted ? "#FF4500" : "#A9A9A9",
                        outline: "none",
                      },
                      pressed: {
                        fill: isHighlighted ? "#E9967A" : "#C0C0C0",
                        outline: "none",
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