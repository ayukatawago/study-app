'use client';

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import centroid from '@turf/centroid';
import { feature } from 'topojson-client';

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
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [countryPosition, setCountryPosition] = React.useState<{ coordinates: [number, number]; bbox?: number[] } | null>(null);
  
  // Find the highlighted country's position in the TopoJSON data
  const findCountryPosition = React.useCallback(async () => {
    if (highlightedCountry) {
      try {
        const response = await fetch(geoUrl);
        const topojsonData = await response.json();
        
        // Convert countryId to number for comparison
        const countryId = Number(highlightedCountry);
        console.log('Looking for country:', countryId);
        
        if (topojsonData && topojsonData.objects && topojsonData.objects.countries) {
          // Find the country in the TopoJSON geometries
          const countryGeom = topojsonData.objects.countries.geometries.find(
            (g: any) => Number(g.id) === countryId
          );
          
          if (countryGeom) {
            console.log('Found country in TopoJSON:', countryGeom.id);
            
            // Extract the country as a GeoJSON feature
            const countryFeature = feature(
              topojsonData, 
              countryGeom
            );
            
            // Calculate centroid using turf
            const countryCentroid = centroid(countryFeature);
            const centerCoords = countryCentroid.geometry.coordinates;
            
            console.log('Country centroid:', centerCoords);
            
            // Get the bounding box if available
            let bbox;
            if (countryGeom.bbox) {
              bbox = countryGeom.bbox;
            }
            
            // Update country position state
            setCountryPosition({
              coordinates: [centerCoords[0], centerCoords[1]] as [number, number],
              bbox: bbox
            });
            
            // For debugging
            console.log('Country position set:', {
              coordinates: [centerCoords[0], centerCoords[1]],
              bbox: bbox
            });
            
            // Auto-zoom to country if countryPosition is set
            setTimeout(() => {
              setPosition({ 
                coordinates: [centerCoords[0], centerCoords[1]] as [number, number], 
                zoom: 4 // Higher zoom level to focus on country
              });
              setIsZoomed(true);
            }, 500);
            
            return;
          }
        }
        
        console.log('Country not found in TopoJSON data:', highlightedCountry);
        setCountryPosition(null);
      } catch (err) {
        console.error('Error fetching or processing map data:', err);
        setCountryPosition(null);
      }
    } else {
      setCountryPosition(null);
    }
  }, [highlightedCountry]);
  
  // When highlighted country changes, find its position
  React.useEffect(() => {
    if (highlightedCountry) {
      findCountryPosition();
    } else {
      // Reset when no country is highlighted
      setPosition({ coordinates: [0, 0] as [number, number], zoom: 1 });
      setIsZoomed(false);
      setCountryPosition(null);
    }
  }, [highlightedCountry, findCountryPosition]);
  
  // Function to zoom in to the target country
  const handleZoomIn = () => {
    if (countryPosition) {
      setPosition({ 
        coordinates: countryPosition.coordinates, 
        zoom: 4 // Higher zoom level to focus on country
      });
      setIsZoomed(true);
    }
  };
  
  // Function to reset zoom
  const handleZoomOut = () => {
    setPosition({ coordinates: [0, 0] as [number, number], zoom: 1 });
    setIsZoomed(false);
  };

  return (
    <div className="world-map-container relative" style={{ width: '100%', height: '100%', padding: 0, margin: 0 }}>
      <div 
        className="absolute top-2 right-2 z-20 flex space-x-2 p-1" 
        style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
      >
        {countryPosition && !isZoomed && (
          <button 
            className="bg-white p-1 rounded shadow-md hover:bg-gray-100 transition-colors border border-gray-300"
            onClick={handleZoomIn}
            title="Zoom to country"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
        )}
        
        {isZoomed && (
          <button 
            className="bg-white p-1 rounded shadow-md hover:bg-gray-100 transition-colors border border-gray-300"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
        )}
      </div>
      
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 120,  // Adjusted scale for proper visibility
          rotate: [0, 0, 0]
        }}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', display: 'block', margin: 0, padding: 0 }}
      >
        <ZoomableGroup 
          center={position.coordinates} 
          zoom={position.zoom}
          maxZoom={5}
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
                    style={{
                      default: {
                        fill: isHighlighted ? "#FF0000" : "#D6D6DA",
                        outline: "none",
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