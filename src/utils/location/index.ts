
// Main location service that brings together all the modules
import { findFiveOClockLocations } from './fiveOClockFinder';
import { addToRecentlyShown, getLastShownLocation, setLastShownLocation } from './recentLocations';
import { assignNewDrinkImage } from './locationVariation'; 
import { createFallbackLocation } from './fallbackLocation';
import { formatLocationName } from './formattingUtilities';
import { LocationResult } from './types';

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
    const lastShownLocation = getLastShownLocation();
    const filteredLocations = lastShownLocation 
      ? locations.filter(loc => `${loc.city}, ${loc.country}` !== lastShownLocation)
      : locations;
    
    // If we have other locations after filtering (or if this is the first run)
    if (filteredLocations.length > 0) {
      // Next, filter out all recently shown locations if possible
      const unseenLocations = filteredLocations.filter(
        location => !getRecentlyShownLocations().includes(`${location.city}, ${location.country}`)
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
  setLastShownLocation(`${selectedLocation.city}, ${selectedLocation.country}`);
  
  return selectedLocation;
};

// Export everything from the service
export { findFiveOClockLocations, formatLocationName, LocationResult };
