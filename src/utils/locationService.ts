
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

/**
 * Find locations where it's currently between 5:00-5:59 PM
 */
export const findFiveOClockLocations = (): LocationResult[] => {
  const now = new Date();
  const fiveOClockLocations: LocationResult[] = [];

  // Get current time in hours (UTC)
  const currentUtcHour = now.getUTCHours();
  const currentUtcMinutes = now.getUTCMinutes();
  const currentUtcTime = currentUtcHour + (currentUtcMinutes / 60);

  TIME_ZONES.forEach(location => {
    try {
      // Calculate the timezone offset for this location by getting the hour in that timezone
      // and comparing it to the UTC hour
      const locationDate = new Date(now);
      const locationOptions = { timeZone: location.timeZone, hour12: false, hour: 'numeric' };
      const locationHourStr = new Intl.DateTimeFormat('en-US', locationOptions).format(locationDate);
      const locationHour = parseInt(locationHourStr, 10);
      
      // Calculate timezone offset by checking the difference between location hour and UTC hour
      // Account for day boundary crossings
      let timezoneOffset = locationHour - currentUtcHour;
      if (timezoneOffset > 12) timezoneOffset -= 24;
      if (timezoneOffset < -12) timezoneOffset += 24;
      
      // Calculate what UTC time corresponds to 5 PM in this location
      // If local time is 5 PM, then UTC time is (5 PM - offset)
      const fivepmInUtc = (17 - timezoneOffset + 24) % 24;
      
      // Determine if current UTC time is within the 5-6 PM window for this location
      // Need to handle the case where the window crosses midnight UTC
      const isCurrentlyFivePM = 
        (fivepmInUtc <= fivepmInUtc + 1) ? 
          (currentUtcTime >= fivepmInUtc && currentUtcTime < fivepmInUtc + 1) :
          (currentUtcTime >= fivepmInUtc || currentUtcTime < (fivepmInUtc + 1) % 24);

      if (isCurrentlyFivePM) {
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

        // Format the local time explicitly with a 12-hour format
        const formattedTime = new Intl.DateTimeFormat('en-US', {
          timeZone: location.timeZone,
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }).format(now);
        
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
 * Get a random location where it's 5 o'clock
 * If no locations found, return a fallback location
 */
export const getRandomFiveOClockLocation = (): LocationResult => {
  const locations = findFiveOClockLocations();
  
  // If we found locations where it's 5 PM, return a random one
  if (locations.length > 0) {
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
  }
  
  // If no locations found where it's currently 5 PM, create a fallback
  // This ensures the app always returns a result
  const fallbackLocation = createFallbackLocation();
  return fallbackLocation;
};

/**
 * Create a fallback location (simulated 5 PM location)
 */
const createFallbackLocation = (): LocationResult => {
  // Get a random location and toast
  const randomLocationIndex = Math.floor(Math.random() * TIME_ZONES.length);
  const location = TIME_ZONES[randomLocationIndex];
  
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
