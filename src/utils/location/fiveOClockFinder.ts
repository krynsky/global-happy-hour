
// Logic for finding locations where it's currently 5 o'clock
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { TIME_ZONES, TOAST_PHRASES, DRINK_IMAGES } from '../constants';
import { LocationResult } from './types';

/**
 * Find locations where it's currently between 5:00-5:59 PM
 */
export const findFiveOClockLocations = (): LocationResult[] => {
  const now = new Date();
  const fiveOClockLocations: LocationResult[] = [];

  // Group locations by time zone to ensure we get variety
  const timeZoneMap = new Map<string, typeof TIME_ZONES[0][]>();
  
  // First, group all locations by their time zone
  TIME_ZONES.forEach(location => {
    if (!timeZoneMap.has(location.timeZone)) {
      timeZoneMap.set(location.timeZone, []);
    }
    timeZoneMap.get(location.timeZone)?.push(location);
  });
  
  // Now process each time zone
  timeZoneMap.forEach((locations, timeZone) => {
    try {
      // Get formatted time string in the timezone with 24-hour format
      const formattedTimeIn24h = formatInTimeZone(
        now, 
        timeZone, 
        'HH:mm'
      );
      
      // Extract hour
      const hour = parseInt(formattedTimeIn24h.split(':')[0], 10);
      
      // Check if it's between 5:00 PM and 5:59 PM (17:00-17:59 in 24-hour format)
      if (hour === 17) {
        // Add all locations in this time zone to our results
        locations.forEach(location => {
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
            timeZone,
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
        });
      }
    } catch (error) {
      console.error(`Error processing timezone ${timeZone}:`, error);
    }
  });

  return fiveOClockLocations;
};
