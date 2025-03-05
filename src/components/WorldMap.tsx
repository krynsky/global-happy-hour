
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { LocationResult } from '@/utils/locationService';

interface WorldMapProps {
  location?: LocationResult;
  isVisible: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ location, isVisible }) => {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globe = useRef<any>(null);
  const [globeLoaded, setGlobeLoaded] = useState(false);
  
  // Initialize globe on component mount
  useEffect(() => {
    if (!globeContainerRef.current || globe.current) return;
    
    try {
      // Create globe instance correctly: first create instance, then initialize with DOM element
      const globeInstance = Globe();
      globe.current = globeInstance(globeContainerRef.current);
      
      // Configure the globe
      globe.current
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .width(globeContainerRef.current.clientWidth)
        .height(400)
        .showAtmosphere(true)
        .atmosphereColor('lightskyblue')
        .atmosphereAltitude(0.1);
      
      // Set initial globe position
      globe.current.controls().autoRotate = true;
      globe.current.controls().autoRotateSpeed = 0.5;
      
      setTimeout(() => {
        setGlobeLoaded(true);
      }, 200);
      
      // Handle resize
      const handleResize = () => {
        if (globeContainerRef.current && globe.current) {
          globe.current.width(globeContainerRef.current.clientWidth);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (globe.current) {
          // Clean up
          globeContainerRef.current?.querySelector('canvas')?.remove();
          globe.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing globe:', error);
    }
  }, []);
  
  // Update marker when location changes
  useEffect(() => {
    if (!globe.current || !location) return;
    
    try {
      // Add point marker for the location
      const pointData = [{
        lat: location.coordinates[1],
        lng: location.coordinates[0],
        size: 0.2,
        color: '#FFD700' // gold color
      }];
      
      // Add ring effect around the point
      const ringData = [{
        lat: location.coordinates[1],
        lng: location.coordinates[0],
        maxR: 3,
        propagationSpeed: 2,
        repeatPeriod: 1000,
        color: () => `rgba(255, 215, 0, ${1 - 0.5 * Math.random()})` // gold with varying opacity
      }];
      
      // Update globe with point and ring data
      globe.current
        .pointsData(pointData)
        .pointAltitude(0.1)
        .pointColor('color')
        .pointRadius('size')
        .ringsData(ringData)
        .ringColor('color')
        .ringMaxRadius('maxR')
        .ringPropagationSpeed('propagationSpeed')
        .ringRepeatPeriod('repeatPeriod');
      
      // Point globe to the location with a closer zoom
      globe.current.pointOfView({
        lat: location.coordinates[1],
        lng: location.coordinates[0],
        altitude: 1.2
      }, 1000);
      
      // Disable auto-rotation after navigating to location
      setTimeout(() => {
        globe.current.controls().autoRotate = false;
      }, 1000);
    } catch (error) {
      console.error('Error updating globe marker:', error);
    }
  }, [location]);
  
  // Re-enable auto-rotation when no location is selected
  useEffect(() => {
    if (!globe.current) return;
    
    if (!location && globe.current.controls()) {
      globe.current.controls().autoRotate = true;
      globe.current.pointsData([]);
      globe.current.ringsData([]);
    }
  }, [location]);
  
  return (
    <div 
      className={`relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ height: '400px' }}
    >
      <div className="absolute inset-0" ref={globeContainerRef}></div>
      
      {!globeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-gold border-r-gold border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading globe...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
