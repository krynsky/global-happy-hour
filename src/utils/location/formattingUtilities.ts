
// Utility functions for formatting location data
import { LocationResult } from './types';

/**
 * Format a location for display
 */
export const formatLocationName = (location: LocationResult): string => {
  return `${location.city}, ${location.country}`;
};
