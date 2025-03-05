
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
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    // Check if token is provided via localStorage
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: DEFAULT_MAP_SETTINGS.style,
        center: DEFAULT_MAP_SETTINGS.center as [number, number],
        zoom: DEFAULT_MAP_SETTINGS.zoom,
        attributionControl: false,
        projection: 'globe',
      });
      
      map.current.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
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
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Error loading map. Please check your Mapbox token.');
      });
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setMapError('Error initializing map. Please check your Mapbox token.');
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);
  
  // Handle token input
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapbox_token') as string;
    
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
      
      // Reset map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    }
  };
  
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
      
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-gold border-r-gold border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
          <p className="text-sm text-red-500 mb-4">{mapError}</p>
          
          <form onSubmit={handleTokenSubmit} className="w-full max-w-sm space-y-2">
            <div>
              <label htmlFor="mapbox_token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter your Mapbox public token:
              </label>
              <input
                type="text"
                name="mapbox_token"
                id="mapbox_token"
                placeholder="pk.eyJ1IjoieW91..."
                className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-gray-800 text-sm px-3 py-2 shadow-sm focus:border-gold focus:ring-gold dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Get your token at <a href="https://www.mapbox.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">mapbox.com</a> (sign up for free)
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-gold px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
            >
              Save Token
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
