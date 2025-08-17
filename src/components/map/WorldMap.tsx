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
  height = 300
}) => {
  // Add animation when a country is highlighted
  const [position, setPosition] = React.useState<{ coordinates: [number, number]; zoom: number }>({ coordinates: [0, 0], zoom: 1 });
  
  React.useEffect(() => {
    if (highlightedCountry) {
      setPosition({ coordinates: [0, 0] as [number, number], zoom: 1 });
    }
  }, [highlightedCountry]);

  return (
    <div className="world-map-container" style={{ width: '100%', height: '100%', padding: 0, margin: 0 }}>
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 120,  // Adjusted scale for proper visibility
          rotate: [0, 0, 0]
        }}
        width={width}
        height={height}
        style={{ width: '100%', height: '80%', display: 'block', margin: 0, padding: 0 }}
      >
        <ZoomableGroup 
          center={position.coordinates} 
          zoom={position.zoom}
          maxZoom={1.5}
          translateExtent={[
            [-width, -height/2], // Extended negative width to ensure full map visibility
            [width, height/2]  // Extended positive width to ensure full map visibility
          ]}
          onMoveEnd={({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) => setPosition({ coordinates, zoom })}
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