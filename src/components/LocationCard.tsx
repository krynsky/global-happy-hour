
import React, { useState } from 'react';
import { LocationResult } from '@/utils/locationService';
import { MapPin, Clock, MessageSquare } from 'lucide-react';

interface LocationCardProps {
  location: LocationResult;
  isVisible: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isVisible }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={`glass-card rounded-2xl overflow-hidden transition-all duration-500 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}></div>
        <img
          src={`${location.drinkImage.url}?auto=format&fit=crop&w=800&q=80`}
          alt={location.drinkImage.description}
          className={`w-full h-full object-cover transition-all duration-700 lazy-image ${imageLoaded ? '' : 'loading'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-xs font-light mb-1 opacity-80">It's 5 o'clock in:</p>
          <h3 className="text-white text-xl font-bold">{location.city}, {location.country}</h3>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-gold" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Local Time</p>
            <p className="text-lg font-semibold">{location.localTime}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gold" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Coordinates</p>
            <p className="text-sm">
              {location.coordinates[1].toFixed(4)}° N, {location.coordinates[0].toFixed(4)}° E
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-5 h-5 text-gold mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Say "Cheers" like a local</p>
            <p className="text-lg font-semibold">{location.toastPhrase.phrase}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pronounced: <span className="italic">{location.toastPhrase.pronunciation}</span>
            </p>
            <p className="text-sm mt-1">{location.toastPhrase.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
