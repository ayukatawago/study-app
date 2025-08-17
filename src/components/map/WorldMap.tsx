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
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

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
  
  // Calculate zoom level based on country size (bounding box)
  const calculateZoomLevel = React.useCallback((bbox?: number[]) => {
    console.log('Calculate zoom level called with bbox:', bbox);
    
    if (!bbox || bbox.length !== 4) {
      console.log('No valid bbox, returning default zoom 3');
      return 3; // Default zoom level if no bbox
    }

    // Extract bounding box dimensions
    const [west, south, east, north] = bbox;
    const width = Math.abs(east - west);
    const height = Math.abs(north - south);
    
    // Calculate area to get a sense of country size
    const area = width * height;
    
    // Log for debugging
    console.log(`Country dimensions: ${width.toFixed(2)} x ${height.toFixed(2)}, area: ${area.toFixed(2)}`);
    
    let zoomLevel;
    // Country size categories (adjusted for better zoom levels)
    if (area > 100) { // Very large countries (Russia, Canada, USA, China, Brazil, etc)
      zoomLevel = 1.5; // Reduced zoom for very large countries
    } else if (area > 30) { // Large countries (India, Australia, most of Europe)
      zoomLevel = 2.5;
    } else if (area > 10) { // Medium-sized countries
      zoomLevel = 3.5;
    } else if (area > 1) { // Small countries
      zoomLevel = 4.5;
    } else { // Very small countries and islands
      zoomLevel = 5.5;
    }
    
    console.log(`Calculated zoom level: ${zoomLevel} for area ${area.toFixed(2)}`);
    return zoomLevel;
  }, []);

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
            let bbox: number[] | undefined;
            if (countryGeom.bbox) {
              bbox = countryGeom.bbox as number[];
              console.log('Found bbox in geometry:', bbox);
            } else {
              console.log('No bbox found in country geometry, trying to create one');
              // If there's no bbox, we could potentially calculate one from the geometry
              // This is a simple approach - might not be perfect
              try {
                // Get coordinates from the feature
                const coords = countryFeature.geometry.coordinates;
                if (coords && coords.length > 0) {
                  // Flatten nested arrays to get all coordinate points
                  const flattenCoords = (arr: any[]): [number, number][] => {
                    return arr.reduce((acc: [number, number][], val: any) => 
                      Array.isArray(val[0]) 
                        ? acc.concat(flattenCoords(val)) 
                        : acc.concat([val as [number, number]]), 
                      [] as [number, number][]);
                  };
                  
                  // Try to flatten the coordinates to extract min/max
                  const points = flattenCoords(coords);
                  
                  if (points.length > 0) {
                    // Find min and max values
                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    
                    for (const [x, y] of points) {
                      minX = Math.min(minX, x);
                      minY = Math.min(minY, y);
                      maxX = Math.max(maxX, x);
                      maxY = Math.max(maxY, y);
                    }
                    
                    bbox = [minX, minY, maxX, maxY];
                    console.log('Created bbox from coordinates:', bbox);
                  }
                }
              } catch (e) {
                console.error('Error creating bbox:', e);
              }
            }
            
            // Calculate appropriate zoom level based on country size
            const zoomLevel = calculateZoomLevel(bbox);
            console.log('Calculated zoom level:', zoomLevel);
            
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
              // Force specific zoom levels for countries
              let testZoom;
              if (countryId === 156) { // China
                testZoom = 2.0;
                console.log('Auto-zoom: Forcing zoom level for China to:', testZoom);
              } else if (countryId === 643) { // Russia
                testZoom = 1.7; 
                console.log('Auto-zoom: Forcing zoom level for Russia to:', testZoom);
              } else if (countryId === 702 || countryId === 706) { // Singapore (both codes)
                testZoom = 7.0;
                console.log('Auto-zoom: Forcing zoom level for Singapore to:', testZoom);
              } else if (countryId === 840) { // USA
                testZoom = 2.3;
                console.log('Auto-zoom: Forcing zoom level for USA to:', testZoom);
              } else if (countryId === 76) { // Brazil
                testZoom = 2.5;
                console.log('Auto-zoom: Forcing zoom level for Brazil to:', testZoom);
              } else if (countryId === 356) { // India
                testZoom = 2.8;
                console.log('Auto-zoom: Forcing zoom level for India to:', testZoom);
              } else if (countryId === 392) { // Japan
                testZoom = 3.5;
                console.log('Auto-zoom: Forcing zoom level for Japan to:', testZoom);
              } else if (countryId === 276) { // Germany
                testZoom = 4.0;
                console.log('Auto-zoom: Forcing zoom level for Germany to:', testZoom);
              } else {
                // Default zoom levels based on area if we have a valid bbox
                if (bbox && bbox.length === 4) {
                  const [west, south, east, north] = bbox;
                  const width = Math.abs(east - west);
                  const height = Math.abs(north - south);
                  const area = width * height;
                  
                  if (area > 100) testZoom = 1.7;      // Very large
                  else if (area > 30) testZoom = 2.5;  // Large
                  else if (area > 10) testZoom = 3.2;  // Medium
                  else if (area > 1) testZoom = 4.5;   // Small
                  else testZoom = 6.0;                 // Very small
                  
                  console.log(`Auto-zoom: Area-based zoom level ${testZoom} for area ${area.toFixed(2)}`);
                } else {
                  // Fallback for countries without bbox
                  testZoom = 3.0;
                  console.log('Auto-zoom: Using fallback zoom level:', testZoom);
                }
              }
              
              setPosition({ 
                coordinates: [centerCoords[0], centerCoords[1]] as [number, number], 
                zoom: testZoom || zoomLevel // Use test zoom if available, otherwise calculated zoom
              });
              setIsZoomed(true);
              console.log(`Auto-zoom complete: zoom level ${testZoom || zoomLevel} for country ${countryId}`);
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
  }, [highlightedCountry, calculateZoomLevel]);
  
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
  const handleZoomIn = (e: React.MouseEvent) => {
    // Stop event propagation to prevent card flip
    e.stopPropagation();
    
    if (countryPosition) {
      console.log('Zoom in button clicked with country position:', countryPosition);
      
      // Calculate zoom level based on country size
      const zoomLevel = calculateZoomLevel(countryPosition.bbox);
      console.log('Zoom button - calculated zoom level:', zoomLevel);
      
      // Force specific zoom levels matching auto-zoom settings
      let testZoom;
      const countryId = Number(highlightedCountry);
      
      if (countryId === 156) { // China
        testZoom = 2.0;
        console.log('Forcing zoom level for China to:', testZoom);
      } else if (countryId === 643) { // Russia
        testZoom = 1.7; 
        console.log('Forcing zoom level for Russia to:', testZoom);
      } else if (countryId === 702 || countryId === 706) { // Singapore (both codes)
        testZoom = 7.0;
        console.log('Forcing zoom level for Singapore to:', testZoom);
      } else if (countryId === 840) { // USA
        testZoom = 2.3;
        console.log('Forcing zoom level for USA to:', testZoom);
      } else if (countryId === 76) { // Brazil
        testZoom = 2.5;
        console.log('Forcing zoom level for Brazil to:', testZoom);
      } else if (countryId === 356) { // India
        testZoom = 2.8;
        console.log('Forcing zoom level for India to:', testZoom);
      } else if (countryId === 392) { // Japan
        testZoom = 3.5;
        console.log('Forcing zoom level for Japan to:', testZoom);
      } else if (countryId === 276) { // Germany
        testZoom = 4.0;
        console.log('Forcing zoom level for Germany to:', testZoom);
      }
      
      setPosition({ 
        coordinates: countryPosition.coordinates, 
        zoom: testZoom || zoomLevel // Use test zoom if available, otherwise calculated zoom
      });
      setIsZoomed(true);
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
    <div className="world-map-container relative" style={{ width: '100%', height: '100%', padding: 0, margin: 0 }}>
      <div 
        className="absolute top-2 right-2 z-20 flex space-x-2 p-1.5 rounded-md" 
        style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(2px)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
      >
        {countryPosition && !isZoomed && (
          <button 
            className="bg-blue-50 p-2 rounded-full shadow-md hover:bg-blue-100 active:bg-blue-200 transition-all duration-150 border border-blue-200 text-blue-600"
            onClick={handleZoomIn}
            title="Zoom to country"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5h5.5a1 1 0 110 2H11V16a1 1 0 11-2 0v-5.5H3.5a1 1 0 110-2H9V3z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {isZoomed && (
          <button 
            className="bg-blue-50 p-2 rounded-full shadow-md hover:bg-blue-100 active:bg-blue-200 transition-all duration-150 border border-blue-200 text-blue-600"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 160,  // Increased scale for better visibility
          rotate: [0, 0, 0]
        }}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', display: 'block', margin: 0, padding: 0 }}
      >
        <ZoomableGroup 
          center={position.coordinates} 
          zoom={position.zoom}
          maxZoom={8} // Increased max zoom to support very small countries
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