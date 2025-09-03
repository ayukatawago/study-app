'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createLogger } from '@/utils/logger';
import 'leaflet/dist/leaflet.css';

const logger = createLogger({ prefix: 'LeafletMap' });

// World map JSON data - use jsdelivr CDN source
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

interface LeafletMapProps {
  highlightedCountry?: string;
  position: { coordinates: [number, number]; zoom: number };
  isTransitioning: boolean;
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
  height,
}) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load world geography data
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const response = await fetch(geoUrl);
        const topojsonData = await response.json();

        // Use topojson-client to properly convert the data
        const { feature } = await import('topojson-client');
        const properGeoJson = {
          type: 'FeatureCollection',
          features: topojsonData.objects.countries.geometries.map((geom: any) =>
            feature(topojsonData, geom)
          ),
        };

        setGeoData(properGeoJson);
        setLoading(false);
      } catch (error) {
        logger.error('Error loading geo data:', error);
        setLoading(false);
      }
    };

    loadGeoData();
  }, []);

  // Style function for countries
  const countryStyle = (feature: any) => {
    const isHighlighted = highlightedCountry && String(feature.id) === String(highlightedCountry);

    return {
      fillColor: isHighlighted ? '#FF0000' : '#D6D6DA',
      weight: 1,
      opacity: 1,
      color: '#999',
      fillOpacity: 0.7,
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
          fillOpacity: 0.7,
        });
      },
    });
  };

  if (loading || !geoData) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: '100%', height: `${height}px` }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[position.coordinates[1], position.coordinates[0]]}
      zoom={position.zoom}
      minZoom={1}
      maxZoom={6}
      style={{
        width: '100%',
        height: '100%',
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
    >
      <MapController position={position} isTransitioning={isTransitioning} />

      {/* No tile layer - we only want the country boundaries */}

      {geoData && <GeoJSON data={geoData} style={countryStyle} onEachFeature={onEachCountry} />}
    </MapContainer>
  );
};

export default LeafletMap;
