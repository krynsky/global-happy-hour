// Manages the tracking of recently shown locations
import { LocationResult } from './types';

// Keep track of recently shown locations (in-memory cache)
const recentlyShownLocations: string[] = [];
const MAX_RECENT_LOCATIONS = 20; // Increase from 10 to better prevent repeats

// Keep track of the last location to avoid immediate repeats
let lastShownLocation: string | null = null;

/**
 * Add a location to the recently shown list
 */
export const addToRecentlyShown = (locationKey: string): void => {
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
 * Get the list of recently shown locations
 */
export const getRecentlyShownLocations = (): string[] => {
  return recentlyShownLocations;
};

/**
 * Get the last shown location
 */
export const getLastShownLocation = (): string | null => {
  return lastShownLocation;
};

/**
 * Set the last shown location
 */
export const setLastShownLocation = (locationKey: string): void => {
  lastShownLocation = locationKey;
};

/**
 * Clear recently shown locations when needed
 * (useful when all locations have been seen)
 */
export const clearRecentlyShownLocations = (): void => {
  recentlyShownLocations.length = 0;
};
