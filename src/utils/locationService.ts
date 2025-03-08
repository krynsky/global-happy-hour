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

// Keep track of the last location to avoid immediate repeats
let lastShownLocation: string | null = null;

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
 * ensuring we don't repeat the same location consecutively
 */
export const getRandomFiveOClockLocation = (): LocationResult => {
  const locations = findFiveOClockLocations();
  let selectedLocation: LocationResult;
  
  // If we found locations where it's 5 PM
  if (locations.length > 0) {
    // First, remove the last shown location from consideration to avoid immediate repeats
    const filteredLocations = lastShownLocation 
      ? locations.filter(loc => `${loc.city}, ${loc.country}` !== lastShownLocation)
      : locations;
    
    // If we have other locations after filtering (or if this is the first run)
    if (filteredLocations.length > 0) {
      // Next, filter out all recently shown locations if possible
      const unseenLocations = filteredLocations.filter(
        location => !recentlyShownLocations.includes(`${location.city}, ${location.country}`)
      );
      
      // Choose from unseen locations if available, otherwise use filtered locations
      const locationsToChooseFrom = unseenLocations.length > 0 ? unseenLocations : filteredLocations;
      
      // Select a random location from the available options
      const randomIndex = Math.floor(Math.random() * locationsToChooseFrom.length);
      selectedLocation = locationsToChooseFrom[randomIndex];
    } else {
      // If filtering out the last location leaves us with nothing (only one 5PM location exists)
      // Then select a random location from all 5PM locations
      const randomIndex = Math.floor(Math.random() * locations.length);
      selectedLocation = locations[randomIndex];
      
      // In this case, we'll attempt to vary the experience by using a different drink image
      // Find a drink image that wasn't used last time if possible
      selectedLocation = assignNewDrinkImage(selectedLocation);
    }
  } else {
    // If no locations found where it's currently 5 PM, create a fallback
    selectedLocation = createFallbackLocation();
  }
  
  // Update the recently shown locations list
  addToRecentlyShown(`${selectedLocation.city}, ${selectedLocation.country}`);
  
  // Update the last shown location to avoid immediate repeats
  lastShownLocation = `${selectedLocation.city}, ${selectedLocation.country}`;
  
  return selectedLocation;
};

/**
 * Assign a new drink image to a location to vary the experience
 * when we have to show the same location again
 */
const assignNewDrinkImage = (location: LocationResult): LocationResult => {
  // Get current drink images except the one we're using
  const otherDrinkImages = DRINK_IMAGES.filter(
    img => img.url !== location.drinkImage.url
  );
  
  // If we have other images, pick a random one
  if (otherDrinkImages.length > 0) {
    const randomImageIndex = Math.floor(Math.random() * otherDrinkImages.length);
    return {
      ...location,
      drinkImage: otherDrinkImages[randomImageIndex]
    };
  }
  
  // Otherwise just return the original location
  return location;
};

/**
 * Add a location to the recently shown list
 */
const addToRecentlyShown = (locationKey: string): void => {
  // Don't add duplicates
  if (!recentlyShownLocations.includes(locationKey)) {
    // Add to the front of the array
    recentlyShownLocations.unshift(locationKey);
    
    // Trim the array if it's too long
    if (recentlyShownLocations.length > MAX_RECENT_LOCATIONS) {
      recentlyShownLocations.pop();
    }
  }
};

/**
 * Create a fallback location (simulated 5 PM location)
 * that avoids showing recently seen locations
 */
const createFallbackLocation = (): LocationResult => {
  // Get all locations that aren't the last shown location
  let availableLocations = lastShownLocation
    ? TIME_ZONES.filter(location => `${location.city}, ${location.country}` !== lastShownLocation)
    : TIME_ZONES;
  
  // If we filtered everything out (unlikely), reset to all locations
  if (availableLocations.length === 0) {
    availableLocations = TIME_ZONES;
  }
  
  // Further filter to avoid recently shown locations if possible
  const unseenLocations = availableLocations.filter(
    location => !recentlyShownLocations.includes(`${location.city}, ${location.country}`)
  );
  
  // Choose from unseen locations or all filtered locations if all have been seen
  const locationsToChooseFrom = unseenLocations.length > 0 ? unseenLocations : availableLocations;
  
  // Get a random location
  const randomLocationIndex = Math.floor(Math.random() * locationsToChooseFrom.length);
  const location = locationsToChooseFrom[randomLocationIndex];
  
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
