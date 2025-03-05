
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, DEFAULT_MAP_SETTINGS } from '@/utils/constants';
import { LocationResult } from '@/utils/locationService';

interface WorldMapProps {
  location?: LocationResult;
  isVisible: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ location, isVisible }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: DEFAULT_MAP_SETTINGS.style,
        center: DEFAULT_MAP_SETTINGS.center,
        zoom: DEFAULT_MAP_SETTINGS.zoom,
        attributionControl: false,
        projection: 'globe',
      });
      
      map.current.on('load', () => {
        setMapLoaded(true);
        if (map.current) {
          // Add atmosphere and fog for a nicer look
          map.current.setFog({
            'color': 'rgb(220, 220, 240)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.4,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });
        }
      });
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update marker when location changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !location) return;
    
    try {
      // If a marker already exists, remove it
      if (marker.current) {
        marker.current.remove();
      }
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'flex flex-col items-center';
      
      const pin = document.createElement('div');
      pin.className = 'w-6 h-6 bg-gold rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold';
      pin.innerHTML = '🍸';
      
      const pulse = document.createElement('div');
      pulse.className = 'w-12 h-12 absolute rounded-full bg-gold/30 animate-ping';
      
      markerEl.appendChild(pulse);
      markerEl.appendChild(pin);
      
      // Create and add the marker
      marker.current = new mapboxgl.Marker(markerEl)
        .setLngLat(location.coordinates)
        .addTo(map.current);
      
      // Fly to the location with animation
      map.current.flyTo({
        center: location.coordinates,
        zoom: 5,
        duration: 2000,
        essential: true
      });
    } catch (error) {
      console.error('Error updating map marker:', error);
    }
  }, [location, mapLoaded]);
  
  return (
    <div 
      className={`relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ height: '400px' }}
    >
      <div className="absolute inset-0 map-container" ref={mapContainer}></div>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-gold border-r-gold border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
