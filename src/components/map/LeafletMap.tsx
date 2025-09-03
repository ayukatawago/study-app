'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createLogger } from '@/utils/logger';
import 'leaflet/dist/leaflet.css';

const logger = createLogger({ prefix: 'LeafletMap' });

// Use Natural Earth data directly from their GitHub which includes complete Russia geometry
const geoUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';

interface LeafletMapProps {
  highlightedCountry?: string;
  position: { coordinates: [number, number]; zoom: number };
  isTransitioning: boolean;
  width: number;
  height: number;
}

// Component to handle map position updates
const MapController: React.FC<{
  position: { coordinates: [number, number]; zoom: number };
  isTransitioning: boolean;
}> = ({ position, isTransitioning }) => {
  const map = useMap();
  const prevPositionRef = useRef(position);

  useEffect(() => {
    if (
      prevPositionRef.current.coordinates[0] !== position.coordinates[0] ||
      prevPositionRef.current.coordinates[1] !== position.coordinates[1] ||
      prevPositionRef.current.zoom !== position.zoom
    ) {
      const latLng = L.latLng(position.coordinates[1], position.coordinates[0]);

      if (isTransitioning) {
        map.flyTo(latLng, position.zoom, {
          duration: 0.5,
          easeLinearity: 0.25,
        });
      } else {
        map.setView(latLng, position.zoom);
      }

      prevPositionRef.current = position;
    }
  }, [map, position, isTransitioning]);

  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  highlightedCountry,
  position,
  isTransitioning,
  width,
  height,
}) => {
  const [rawGeoData, setRawGeoData] = useState<any>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load world geography data
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const response = await fetch(geoUrl);
        const geojsonData = await response.json();

        // This is already GeoJSON format, so we can use it directly
        // Need to map country names/codes properly for highlighting
        if (geojsonData && geojsonData.features) {
          geojsonData.features.forEach((f: any) => {
            // Create a country code mapping based on various properties
            const props = f.properties || {};

            // Use ISO numeric codes if available, otherwise create mapping
            if (props.ISO_N3) {
              // Natural Earth provides ISO_N3 as string, ensure it's the right format
              f.id = String(props.ISO_N3).padStart(3, '0');
            } else if (props.ISO_A3) {
              // Map ISO_A3 codes to ISO numeric codes for compatibility with world_countries.json
              const isoMapping: { [key: string]: string } = {
                RUS: '643', // Russia
                CHN: '156', // China
                USA: '840', // United States
                JPN: '392', // Japan
                DEU: '276', // Germany
                FRA: '250', // France
                GBR: '826', // United Kingdom
                IND: '356', // India
                BRA: '076', // Brazil
                AUS: '036', // Australia
                CAN: '124', // Canada
                ITA: '380', // Italy
                ESP: '724', // Spain
                KOR: '410', // South Korea
                MEX: '484', // Mexico
                IDN: '360', // Indonesia
                TUR: '792', // Turkey
                SAU: '682', // Saudi Arabia
                ARG: '032', // Argentina
                ZAF: '710', // South Africa
                EGY: '818', // Egypt
                THA: '764', // Thailand
                IRN: '364', // Iran
                POL: '616', // Poland
                UKR: '804', // Ukraine
                MYS: '458', // Malaysia
                VNM: '704', // Vietnam
                PHL: '608', // Philippines
                NLD: '528', // Netherlands
                BEL: '056', // Belgium
                GRC: '300', // Greece
                PRT: '620', // Portugal
                CZE: '203', // Czech Republic
                HUN: '348', // Hungary
                SWE: '752', // Sweden
                NOR: '578', // Norway
                FIN: '246', // Finland
                DNK: '208', // Denmark
                CHE: '756', // Switzerland
                AUT: '040', // Austria
                ISR: '376', // Israel
                SGP: '702', // Singapore
                NZL: '554', // New Zealand
              };
              f.id = isoMapping[props.ISO_A3] || String(props.ISO_N3 || '999').padStart(3, '0');
            } else {
              // Fallback to country name
              f.id = props.NAME || props.ADMIN || props.NAME_EN || props.SOVEREIGNT;
            }
          });
        }

        setRawGeoData(geojsonData);
        setLoading(false);
      } catch (error) {
        logger.error('Error loading geo data:', error);
        setLoading(false);
      }
    };

    loadGeoData();
  }, []);

  // Process geo data based on highlighted country
  useEffect(() => {
    if (!rawGeoData) return;

    const processCountryGeometry = (feature: any) => {
      // Filter out features that might cause rendering issues
      if (!feature || !feature.geometry || !feature.id) {
        return null;
      }

      return feature;
    };

    const processedGeoJson = {
      ...rawGeoData,
      features: rawGeoData.features.map(processCountryGeometry).filter((f: any) => f !== null),
    };

    setGeoData(processedGeoJson);
  }, [rawGeoData, highlightedCountry]);

  // Style function for countries
  const countryStyle = (feature: any) => {
    const isHighlighted = highlightedCountry && String(feature.id) === String(highlightedCountry);

    return {
      fillColor: isHighlighted ? '#FF0000' : '#D6D6DA',
      weight: 1,
      opacity: 1,
      color: '#999',
      fillOpacity: isHighlighted ? 0.8 : 0.7,
      stroke: true,
    };
  };

  // Event handlers for country interactions
  const onEachCountry = (feature: any, layer: L.Layer) => {
    const isHighlighted = highlightedCountry && String(feature.id) === String(highlightedCountry);

    layer.on({
      mouseover: e => {
        const layer = e.target;
        layer.setStyle({
          fillColor: isHighlighted ? '#FF4500' : '#A9A9A9',
          weight: 2,
          fillOpacity: 0.9,
        });
      },
      mouseout: e => {
        const layer = e.target;
        layer.setStyle({
          fillColor: isHighlighted ? '#FF0000' : '#D6D6DA',
          weight: 1,
          fillOpacity: isHighlighted ? 0.8 : 0.7,
        });
      },
    });
  };

  if (loading || !geoData) {
    return (
      <div
        className="flex items-center justify-center w-full h-full"
        style={{ minHeight: `${height}px` }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[position.coordinates[1], position.coordinates[0]]}
      zoom={position.zoom}
      minZoom={0.1}
      maxZoom={6}
      bounds={[
        [-70, -240],
        [85, 240],
      ]}
      boundsOptions={{ padding: [5, 5] }}
      style={{
        width: '100%',
        height: '100%',
        minHeight: `${height}px`,
        maxWidth: `${width}px`,
        filter: isTransitioning ? 'brightness(1.05)' : 'none',
        transition: 'filter 0.3s ease-in-out',
      }}
      attributionControl={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      worldCopyJump={true}
    >
      <MapController position={position} isTransitioning={isTransitioning} />

      {/* No tile layer - we only want the country boundaries */}

      {geoData && (
        <GeoJSON
          data={geoData}
          style={countryStyle}
          onEachFeature={(feature, layer) => {
            try {
              onEachCountry(feature, layer);
            } catch (error) {
              logger.error('Error in onEachCountry:', error, 'Feature:', feature);
            }
          }}
          key={`geojson-${highlightedCountry || 'default'}`}
        />
      )}
    </MapContainer>
  );
};

export default LeafletMap;
