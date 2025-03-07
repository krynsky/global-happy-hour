
import React, { useState, useEffect } from 'react';
import DrinkButton from '@/components/DrinkButton';
import LocationCard from '@/components/LocationCard';
import WorldMap from '@/components/WorldMap';
import { getRandomFiveOClockLocation, LocationResult } from '@/utils/locationService';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<LocationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const findLocation = async () => {
    setIsLoading(true);
    setShowResults(false);
    
    try {
      // Add a small delay to make the animation feel smoother
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const location = getRandomFiveOClockLocation();
      setCurrentLocation(location);
      
      // Short delay before showing results for better animation
      setTimeout(() => {
        setShowResults(true);
      }, 300);
      
      toast({
        title: "Found a place to drink!",
        description: `It's currently 5 o'clock in ${location.city}, ${location.country}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error finding location:', error);
      toast({
        title: "Error finding location",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-b from-background to-background/80">
      {/* Decorative blurs */}
      <div className="fancy-blur blur-gold absolute top-20 left-1/4"></div>
      <div className="fancy-blur blur-blue absolute bottom-40 right-1/4"></div>
      
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-navy-light/10 backdrop-blur-sm px-4 py-1 rounded-full mb-3">
            <p className="text-sm font-medium text-navy-dark">Always a good time somewhere</p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-dark mb-3 tracking-tight">
            It's 5 O'Clock <span className="text-gold">Somewhere</span>
          </h1>
          <p className="text-lg md:text-xl text-navy-light/80 max-w-2xl mx-auto">
            Find a place in the world where it's happy hour right now, and learn how to toast like a local.
          </p>
        </header>
        
        <div className="flex flex-col items-center mb-16">
          <DrinkButton onClick={findLocation} isLoading={isLoading} />
          <p className="text-amber-600 mt-3 text-sm font-medium">There may be issues with the time calculation that will be fixed</p>
        </div>
        
        {currentLocation && (
          <div className="grid md:grid-cols-2 gap-8 relative">
            <LocationCard 
              location={currentLocation} 
              isVisible={showResults} 
            />
            
            <WorldMap 
              location={currentLocation} 
              isVisible={showResults} 
            />
          </div>
        )}
        
        {!currentLocation && !isLoading && (
          <div className="text-center p-12 glass-effect rounded-xl max-w-xl mx-auto">
            <h3 className="text-xl font-medium mb-3">Ready for a drink?</h3>
            <p className="text-navy-light/80">
              Press the button above to find a place in the world where it's currently 5 o'clock - the universally accepted time to enjoy a beverage.
            </p>
          </div>
        )}
        
        <footer className="mt-20 text-center text-sm text-navy-light/60">
          <p>Remember to drink responsibly, no matter what time zone you're in!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
