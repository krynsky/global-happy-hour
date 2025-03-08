// Functions to provide variety when showing the same location multiple times
import { DRINK_IMAGES } from '../constants';
import { LocationResult } from './types';

/**
 * Assign a new drink image to a location to vary the experience
 * when we have to show the same location again
 */
export const assignNewDrinkImage = (location: LocationResult): LocationResult => {
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
