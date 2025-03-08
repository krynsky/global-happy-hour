import { TIME_ZONES, TOAST_PHRASES, DRINK_IMAGES } from './constants';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Interface for location result
export interface LocationResult {
  country: string;
  city: string;
  localTime: string;
  coordinates: [number, number]; // Explicitly typed as a tuple
  toastPhrase: {
    phrase: string;
    pronunciation: string;
    description: string;
  };
  drinkImage: {
    url: string;
    description: string;
  };
}

// Keep track of recently shown locations (in-memory cache)
const recentlyShownLocations: string[] = [];
const MAX_RECENT_LOCATIONS = 10;

/**
 * Find locations where it's currently between 5:00-5:59 PM
 */
export const findFiveOClockLocations = (): LocationResult[] => {
  const now = new Date();
  const fiveOClockLocations: LocationResult[] = [];

  TIME_ZONES.forEach(location => {
    try {
      // Get formatted time string in the timezone with 24-hour format
      const formattedTimeIn24h = formatInTimeZone(
        now, 
        location.timeZone, 
        'HH:mm'
      );
      
      // Extract hour
      const hour = parseInt(formattedTimeIn24h.split(':')[0], 10);
      
      // Check if it's between 5:00 PM and 5:59 PM (17:00-17:59 in 24-hour format)
      if (hour === 17) {
        // Find toast phrase for this country
        const toastInfo = TOAST_PHRASES.find(
          toast => toast.country === location.country && toast.city === location.city
        ) || TOAST_PHRASES.find(toast => toast.country === location.country) || TOAST_PHRASES[0];

        // Get a random drink image with URL validation
        let drinkImage;
        let attempts = 0;
        // Try up to 3 random images to avoid broken links
        while (attempts < 3) {
          const randomIndex = Math.floor(Math.random() * DRINK_IMAGES.length);
          drinkImage = DRINK_IMAGES[randomIndex];
          // Simple validation to ensure URL is not empty
          if (drinkImage.url && drinkImage.url.startsWith('http')) {
            break;
          }
          attempts++;
        }
        // Fallback if all attempts fail
        if (!drinkImage || !drinkImage.url || !drinkImage.url.startsWith('http')) {
          drinkImage = {
            url: "https://placehold.co/800x450/27374d/FFF?text=Cheers!",
            description: "Placeholder drink image"
          };
        }

        // Format the local time with a 12-hour format using date-fns-tz
        const formattedTime = formatInTimeZone(
          now,
          location.timeZone,
          'h:mm a'
        );
        
        fiveOClockLocations.push({
          country: location.country,
          city: location.city,
          localTime: formattedTime,
          coordinates: location.coordinates as [number, number],
          toastPhrase: {
            phrase: toastInfo.phrase,
            pronunciation: toastInfo.pronunciation,
            description: toastInfo.description
          },
          drinkImage: drinkImage
        });
      }
    } catch (error) {
      console.error(`Error processing timezone ${location.timeZone}:`, error);
    }
  });

  return fiveOClockLocations;
};

/**
 * Get a random location where it's 5 o'clock,
 * avoiding recently shown locations when possible
 */
export const getRandomFiveOClockLocation = (): LocationResult => {
  const locations = findFiveOClockLocations();
  
  // If we found locations where it's 5 PM
  if (locations.length > 0) {
    // Filter out recently shown locations if possible
    const unseenLocations = locations.filter(
      location => !recentlyShownLocations.includes(`${location.city}, ${location.country}`)
    );
    
    // If we have unseen locations, use one of those
    if (unseenLocations.length > 0) {
      const randomIndex = Math.floor(Math.random() * unseenLocations.length);
      const selectedLocation = unseenLocations[randomIndex];
      
      // Add to recently shown locations
      addToRecentlyShown(`${selectedLocation.city}, ${selectedLocation.country}`);
      
      return selectedLocation;
    }
    
    // If all current 5 o'clock locations have been recently shown,
    // just pick a random one from all available
    const randomIndex = Math.floor(Math.random() * locations.length);
    const selectedLocation = locations[randomIndex];
    
    // Add to recently shown locations
    addToRecentlyShown(`${selectedLocation.city}, ${selectedLocation.country}`);
    
    return selectedLocation;
  }
  
  // If no locations found where it's currently 5 PM, create a fallback
  const fallbackLocation = createFallbackLocation();
  
  // Add fallback to recently shown to avoid repeats when possible
  addToRecentlyShown(`${fallbackLocation.city}, ${fallbackLocation.country}`);
  
  return fallbackLocation;
};

/**
 * Add a location to the recently shown list
 */
const addToRecentlyShown = (locationKey: string): void => {
  // Add to the front of the array
  recentlyShownLocations.unshift(locationKey);
  
  // Trim the array if it's too long
  if (recentlyShownLocations.length > MAX_RECENT_LOCATIONS) {
    recentlyShownLocations.pop();
  }
};

/**
 * Create a fallback location (simulated 5 PM location)
 * that avoids showing recently seen locations
 */
const createFallbackLocation = (): LocationResult => {
  // Get all locations that haven't been recently shown
  const unseenLocations = TIME_ZONES.filter(
    location => !recentlyShownLocations.includes(`${location.city}, ${location.country}`)
  );
  
  // Choose from unseen locations or all locations if all have been seen
  const availableLocations = unseenLocations.length > 0 ? unseenLocations : TIME_ZONES;
  
  // Get a random location
  const randomLocationIndex = Math.floor(Math.random() * availableLocations.length);
  const location = availableLocations[randomLocationIndex];
  
  const toastInfo = TOAST_PHRASES.find(
    toast => toast.country === location.country && toast.city === location.city
  ) || TOAST_PHRASES.find(toast => toast.country === location.country) || TOAST_PHRASES[0];
  
  // Get a random drink image
  const randomImageIndex = Math.floor(Math.random() * DRINK_IMAGES.length);
  const drinkImage = DRINK_IMAGES[randomImageIndex];
  
  // Generate a random minute value between 0-59 for more realistic time
  const randomMinute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  
  // Set time to 5 PM with random minutes
  const formattedTime = `5:${randomMinute} PM`;
  
  return {
    country: location.country,
    city: location.city,
    localTime: formattedTime,
    coordinates: location.coordinates as [number, number],
    toastPhrase: {
      phrase: toastInfo.phrase,
      pronunciation: toastInfo.pronunciation,
      description: toastInfo.description
    },
    drinkImage: {
      url: drinkImage.url,
      description: drinkImage.description
    }
  };
};

/**
 * Format a location for display
 */
export const formatLocationName = (location: LocationResult): string => {
  return `${location.city}, ${location.country}`;
};
