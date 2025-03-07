import { TIME_ZONES, TOAST_PHRASES, DRINK_IMAGES } from './constants';

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

  TIME_ZONES.forEach(location => {
    try {
      // Get the current time in this location's timezone
      // Create a formatter for this specific timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: location.timeZone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      
      // Format the date to get the localized time string
      const localTimeStr = formatter.format(now);
      
      // Extract hours from the formatted time string (expected format: "HH:MM")
      const [hoursStr, minutesStr] = localTimeStr.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      // Check if it's between 5:00-5:59 PM (17:00-17:59) in this location
      if (hours === 17) {
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

        // Create a new Date object to get proper time formatting
        // We use the local timezone here, but with hours and minutes from the target timezone
        const localDate = new Date();
        localDate.setHours(hours);
        localDate.setMinutes(minutes);
        
        // Format the time with minutes
        const formattedTime = localDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: 'numeric',
          hour12: true 
        });

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
  const randomMinute = Math.floor(Math.random() * 60);
  const fallbackTime = new Date();
  fallbackTime.setHours(17);
  fallbackTime.setMinutes(randomMinute);
  
  const formattedTime = fallbackTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  
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
