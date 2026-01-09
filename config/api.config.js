// API Configuration
export const API_CONFIG = {
  // Toggle between mock data and real APIs
  USE_MOCK_DATA: true,
  
  // Enable/disable external API integrations
  USE_EXTERNAL_APIS: {
    amadeus: false, // Set to true when you have valid Amadeus credentials
    booking: false, // Set to true when you have valid Booking.com credentials
    google: true,   // Google Maps API for location services
  },
  
  // API endpoints
  ENDPOINTS: {
    BASE_URL: process.env.API_BASE_URL || 'https://api.roamly.com',
    AMADEUS_BASE: 'https://test.api.amadeus.com/v2',
    BOOKING_BASE: 'https://booking-com.p.rapidapi.com/v1',
  },
  
  // Cache settings
  CACHE: {
    ENABLED: true,
    EXPIRY_TIME: 5 * 60 * 1000, // 5 minutes
    KEYS: {
      POPULAR_DESTINATIONS: 'popular_destinations',
      CATEGORIES: 'categories',
      FAVORITES: 'favorites',
      HOTELS: 'hotels',
      RESTAURANTS: 'restaurants',
      ATTRACTIONS: 'attractions',
      SHOPPING: 'shopping',
    },
  },
  
  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    SEARCH: 15000,  // 15 seconds for search operations
    EXTERNAL_API: 20000, // 20 seconds for external APIs
  },
  
  // Retry configuration
  RETRY: {
    ATTEMPTS: 2,
    DELAY: 1000, // 1 second
  },
};

// Helper to check if we should use real APIs
export const shouldUseRealAPI = (apiType) => {
  return !API_CONFIG.USE_MOCK_DATA && API_CONFIG.USE_EXTERNAL_APIS[apiType];
};

// Helper to get API endpoint
export const getAPIEndpoint = (path) => {
  return `${API_CONFIG.ENDPOINTS.BASE_URL}${path}`;
};