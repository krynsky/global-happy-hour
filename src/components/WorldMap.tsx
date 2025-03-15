
import React, { useEffect, useRef, useState } from 'react';
import { LocationResult } from '@/utils/locationService';

interface WorldMapProps {
  location?: LocationResult;
  isVisible: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ location, isVisible }) => {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // Initialize globe on component mount
  useEffect(() => {
    // Only initialize if the container exists and we haven't already initialized
    if (!globeContainerRef.current || globeRef.current) return;
    
    // Dynamic import of Globe.gl to fix loading issues
    const initGlobe = async () => {
      try {
        // Import Globe dynamically
        const Globe = (await import('globe.gl')).default;
        
        if (globeContainerRef.current) {
          // Create globe instance
          const globe = Globe()(globeContainerRef.current);
          
          // Configure the globe
          globe
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .width(globeContainerRef.current.clientWidth)
            .height(400)
            .showAtmosphere(true)
            .atmosphereColor('lightskyblue')
            .atmosphereAltitude(0.1);
          
          // Set initial globe position
          globe.controls().autoRotate = true;
          globe.controls().autoRotateSpeed = 0.5;
          
          // Store the globe reference
          globeRef.current = globe;
          
          setTimeout(() => {
            setGlobeLoaded(true);
          }, 200);
        }
      } catch (error) {
        console.error('Error initializing globe:', error);
        setLoadError(true);
      }
    };
    
    // Initialize the globe
    initGlobe();
    
    // Handle resize
    const handleResize = () => {
      if (globeContainerRef.current && globeRef.current) {
        globeRef.current.width(globeContainerRef.current.clientWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        // Proper cleanup
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, []);
  
  // Update marker when location changes
  useEffect(() => {
    if (!globeRef.current || !location) return;
    
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
      globeRef.current
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
      globeRef.current.pointOfView({
        lat: location.coordinates[1],
        lng: location.coordinates[0],
        altitude: 0.7  // Reduced from 1.2 to 0.7 for a closer view
      }, 1000);
      
      // Disable auto-rotation after navigating to location
      setTimeout(() => {
        globeRef.current.controls().autoRotate = false;
      }, 1000);
    } catch (error) {
      console.error('Error updating globe marker:', error);
    }
  }, [location]);
  
  // Re-enable auto-rotation when no location is selected
  useEffect(() => {
    if (!globeRef.current) return;
    
    if (!location && globeRef.current.controls()) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.pointsData([]);
      globeRef.current.ringsData([]);
      
      // Reset to a wider view when no location is selected
      globeRef.current.pointOfView({
        lat: 0,
        lng: 0,
        altitude: 2.5
      }, 1000);
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
      
      {!globeLoaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-gold border-r-gold border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading globe...</p>
          </div>
        </div>
      )}
      
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-6">
            <p className="text-amber-600 font-medium mb-2">Unable to load globe visualization</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try refreshing the page or check your internet connection
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
