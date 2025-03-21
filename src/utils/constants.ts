// Collection of toast phrases from around the world
export const TOAST_PHRASES = [
  { country: "USA", city: "New York", phrase: "Cheers!", pronunciation: "cheers", description: "Simple and classic American toast." },
  { country: "Spain", city: "Madrid", phrase: "¡Salud!", pronunciation: "sah-lood", description: "Meaning 'health' in Spanish." },
  { country: "France", city: "Paris", phrase: "Santé!", pronunciation: "sahn-tay", description: "A toast to your health." },
  { country: "Germany", city: "Berlin", phrase: "Prost!", pronunciation: "prohst", description: "Traditional German beer toast." },
  { country: "Italy", city: "Rome", phrase: "Salute!", pronunciation: "sah-loo-tay", description: "Wishing good health in Italian." },
  { country: "Russia", city: "Moscow", phrase: "На здоровье!", pronunciation: "na zdor-o-vye", description: "Means 'to your health' in Russian." },
  { country: "Japan", city: "Tokyo", phrase: "乾杯!", pronunciation: "kan-pai", description: "Literally means 'dry the glass'." },
  { country: "China", city: "Beijing", phrase: "干杯!", pronunciation: "gān bēi", description: "Means 'empty glass' in Chinese." },
  { country: "Greece", city: "Athens", phrase: "Γεια μας!", pronunciation: "ya mas", description: "Means 'to our health' in Greek." },
  { country: "Ireland", city: "Dublin", phrase: "Sláinte!", pronunciation: "slawn-cha", description: "Gaelic toast meaning 'health'." },
  { country: "Sweden", city: "Stockholm", phrase: "Skål!", pronunciation: "skawl", description: "Traditional Nordic toast." },
  { country: "Poland", city: "Warsaw", phrase: "Na zdrowie!", pronunciation: "nah zdro-vee-ay", description: "Polish toast to good health." },
  { country: "Turkey", city: "Istanbul", phrase: "Şerefe!", pronunciation: "share-ef-eh", description: "Means 'to honor' in Turkish." },
  { country: "Brazil", city: "Rio de Janeiro", phrase: "Saúde!", pronunciation: "sah-OO-jay", description: "Portuguese toast to health." },
  { country: "Netherlands", city: "Amsterdam", phrase: "Proost!", pronunciation: "prohst", description: "Traditional Dutch toast." },
  { country: "South Africa", city: "Cape Town", phrase: "Gesondheid!", pronunciation: "ge-sund-hate", description: "Afrikaans toast to health." },
  { country: "Mexico", city: "Mexico City", phrase: "¡Salud!", pronunciation: "sah-lood", description: "Spanish toast used in Mexico." },
  { country: "Argentina", city: "Buenos Aires", phrase: "¡Salud!", pronunciation: "sah-lood", description: "Traditional toast in Argentina." },
  { country: "Israel", city: "Tel Aviv", phrase: "לחיים!", pronunciation: "l'chaim", description: "Hebrew toast meaning 'to life'." },
  { country: "India", city: "Mumbai", phrase: "चीयर्स!", pronunciation: "cheers", description: "Adopted English toast in India." },
  { country: "Thailand", city: "Bangkok", phrase: "ชัยโย!", pronunciation: "chai-yo", description: "Thai expression of celebration." },
  { country: "Australia", city: "Sydney", phrase: "Cheers, mate!", pronunciation: "cheers mate", description: "Casual Australian toast." },
  { country: "Denmark", city: "Copenhagen", phrase: "Skål!", pronunciation: "skawl", description: "Traditional Danish toast." },
  { country: "Hungary", city: "Budapest", phrase: "Egészségedre!", pronunciation: "egg-ess-shay-ged-reh", description: "Hungarian toast to your health." },
  { country: "Czech Republic", city: "Prague", phrase: "Na zdraví!", pronunciation: "naz-drah-vee", description: "Czech toast to health." },
  { country: "Portugal", city: "Lisbon", phrase: "Saúde!", pronunciation: "sa-OO-de", description: "Portuguese toast to health." },
  { country: "Finland", city: "Helsinki", phrase: "Kippis!", pronunciation: "kip-piss", description: "Finnish toast when clinking glasses." },
  { country: "Norway", city: "Oslo", phrase: "Skål!", pronunciation: "skawl", description: "Norwegian toast tradition." },
  { country: "South Korea", city: "Seoul", phrase: "건배!", pronunciation: "geonbae", description: "Korean toast meaning 'cheers'." },
  { country: "Vietnam", city: "Ho Chi Minh City", phrase: "Một, hai, ba, vô!", pronunciation: "moat, hi, ba, yo", description: "Vietnamese countdown toast." }
];

// Time zones around the world for major cities
export const TIME_ZONES = [
  { country: "USA", city: "New York", timeZone: "America/New_York", coordinates: [-74.006, 40.7128] as [number, number] },
  { country: "USA", city: "Los Angeles", timeZone: "America/Los_Angeles", coordinates: [-118.2437, 34.0522] as [number, number] },
  { country: "USA", city: "Chicago", timeZone: "America/Chicago", coordinates: [-87.6298, 41.8781] as [number, number] },
  { country: "USA", city: "Denver", timeZone: "America/Denver", coordinates: [-104.9903, 39.7392] as [number, number] },
  { country: "Spain", city: "Madrid", timeZone: "Europe/Madrid", coordinates: [-3.7038, 40.4168] as [number, number] },
  { country: "France", city: "Paris", timeZone: "Europe/Paris", coordinates: [2.3522, 48.8566] as [number, number] },
  { country: "Germany", city: "Berlin", timeZone: "Europe/Berlin", coordinates: [13.4050, 52.5200] as [number, number] },
  { country: "Italy", city: "Rome", timeZone: "Europe/Rome", coordinates: [12.4964, 41.9028] as [number, number] },
  { country: "UK", city: "London", timeZone: "Europe/London", coordinates: [-0.1278, 51.5074] as [number, number] },
  { country: "Russia", city: "Moscow", timeZone: "Europe/Moscow", coordinates: [37.6173, 55.7558] as [number, number] },
  { country: "Japan", city: "Tokyo", timeZone: "Asia/Tokyo", coordinates: [139.6917, 35.6895] as [number, number] },
  { country: "China", city: "Beijing", timeZone: "Asia/Shanghai", coordinates: [116.4074, 39.9042] as [number, number] },
  { country: "Australia", city: "Sydney", timeZone: "Australia/Sydney", coordinates: [151.2093, -33.8688] as [number, number] },
  { country: "Brazil", city: "Rio de Janeiro", timeZone: "America/Sao_Paulo", coordinates: [-43.1729, -22.9068] as [number, number] },
  { country: "South Africa", city: "Cape Town", timeZone: "Africa/Johannesburg", coordinates: [18.4241, -33.9249] as [number, number] },
  { country: "Mexico", city: "Mexico City", timeZone: "America/Mexico_City", coordinates: [-99.1332, 19.4326] as [number, number] },
  { country: "India", city: "Mumbai", timeZone: "Asia/Kolkata", coordinates: [72.8777, 19.0760] as [number, number] },
  { country: "UAE", city: "Dubai", timeZone: "Asia/Dubai", coordinates: [55.2708, 25.2048] as [number, number] },
  { country: "Singapore", city: "Singapore", timeZone: "Asia/Singapore", coordinates: [103.8198, 1.3521] as [number, number] },
  { country: "Netherlands", city: "Amsterdam", timeZone: "Europe/Amsterdam", coordinates: [4.9041, 52.3676] as [number, number] },
  { country: "Greece", city: "Athens", timeZone: "Europe/Athens", coordinates: [23.7275, 37.9838] as [number, number] },
  { country: "Turkey", city: "Istanbul", timeZone: "Europe/Istanbul", coordinates: [28.9784, 41.0082] as [number, number] },
  { country: "Argentina", city: "Buenos Aires", timeZone: "America/Argentina/Buenos_Aires", coordinates: [-58.3816, -34.6037] as [number, number] },
  { country: "Ireland", city: "Dublin", timeZone: "Europe/Dublin", coordinates: [-6.2603, 53.3498] as [number, number] },
  { country: "Sweden", city: "Stockholm", timeZone: "Europe/Stockholm", coordinates: [18.0686, 59.3293] as [number, number] },
  { country: "Poland", city: "Warsaw", timeZone: "Europe/Warsaw", coordinates: [21.0122, 52.2297] as [number, number] },
  { country: "Thailand", city: "Bangkok", timeZone: "Asia/Bangkok", coordinates: [100.5018, 13.7563] as [number, number] },
  { country: "New Zealand", city: "Auckland", timeZone: "Pacific/Auckland", coordinates: [174.7633, -36.8485] as [number, number] },
  { country: "Czech Republic", city: "Prague", timeZone: "Europe/Prague", coordinates: [14.4378, 50.0755] as [number, number] },
  { country: "Hungary", city: "Budapest", timeZone: "Europe/Budapest", coordinates: [19.0402, 47.4979] as [number, number] },
  { country: "Denmark", city: "Copenhagen", timeZone: "Europe/Copenhagen", coordinates: [12.5683, 55.6761] as [number, number] },
  { country: "Finland", city: "Helsinki", timeZone: "Europe/Helsinki", coordinates: [24.9384, 60.1699] as [number, number] },
  { country: "Norway", city: "Oslo", timeZone: "Europe/Oslo", coordinates: [10.7522, 59.9139] as [number, number] },
  { country: "Portugal", city: "Lisbon", timeZone: "Europe/Lisbon", coordinates: [-9.1393, 38.7223] as [number, number] },
  { country: "South Korea", city: "Seoul", timeZone: "Asia/Seoul", coordinates: [126.9780, 37.5665] as [number, number] },
  { country: "Vietnam", city: "Ho Chi Minh City", timeZone: "Asia/Ho_Chi_Minh", coordinates: [106.6297, 10.8231] as [number, number] },
  { country: "Israel", city: "Tel Aviv", timeZone: "Asia/Jerusalem", coordinates: [34.7818, 32.0853] as [number, number] },
  { country: "Philippines", city: "Manila", timeZone: "Asia/Manila", coordinates: [120.9842, 14.5995] as [number, number] },
  { country: "Egypt", city: "Cairo", timeZone: "Africa/Cairo", coordinates: [31.2357, 30.0444] as [number, number] },
  { country: "Peru", city: "Lima", timeZone: "America/Lima", coordinates: [-77.0428, -12.0464] as [number, number] }
];

// Stock photos of people having drinks in different locations - Updated with more reliable image URLs
export const DRINK_IMAGES = [
  { id: 1, url: "https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Friends toasting at a dinner party" },
  { id: 2, url: "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800", description: "People toasting with beer glasses" },
  { id: 3, url: "https://images.pexels.com/photos/3943297/pexels-photo-3943297.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Friends clinking wine glasses" },
  { id: 4, url: "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Toasting champagne glasses" },
  { id: 5, url: "https://images.pexels.com/photos/1097425/pexels-photo-1097425.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Friends drinking at night" },
  { id: 6, url: "https://images.pexels.com/photos/4255489/pexels-photo-4255489.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Cheers with cocktails" },
  { id: 7, url: "https://images.pexels.com/photos/1304473/pexels-photo-1304473.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Friends at a beach bar" },
  { id: 8, url: "https://images.pexels.com/photos/3641979/pexels-photo-3641979.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Garden party with drinks" },
  { id: 9, url: "https://images.pexels.com/photos/4255483/pexels-photo-4255483.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Cocktails at sunset" },
  { id: 10, url: "https://images.pexels.com/photos/3825412/pexels-photo-3825412.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Clinking wine glasses at dinner" },
  { id: 11, url: "https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Friends toasting at home" },
  { id: 12, url: "https://images.pexels.com/photos/5778892/pexels-photo-5778892.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Celebration with drinks" }
];

// Mapbox token placeholder - user needs to add their own
export const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZWJvdCIsImEiOiJjbHc2NG1yMjkwN3MzMmpuMXVvaGVhMm0zIn0.rQwLnBPi7YbXK5jmANfNEA";

// Default map settings
export const DEFAULT_MAP_SETTINGS = {
  style: 'mapbox://styles/mapbox/light-v11',
  zoom: 2.5,
  center: [0, 20] as [number, number],
};
