
// Provides fallback functionality when no 5 o'clock locations are found
import { TIME_ZONES, TOAST_PHRASES, DRINK_IMAGES } from '../constants';
import { LocationResult } from './types';
import { getRecentlyShownLocations, getLastShownLocation } from './recentLocations';

/**
 * Create a fallback location (simulated 5 PM location)
 * that avoids showing recently seen locations
 */
export const createFallbackLocation = (): LocationResult => {
  const lastShownLocation = getLastShownLocation();
  const recentlyShownLocations = getRecentlyShownLocations();
  
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
