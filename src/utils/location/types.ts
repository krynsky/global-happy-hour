
// Define interfaces and types for location data
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
