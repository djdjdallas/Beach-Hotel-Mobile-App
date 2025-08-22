export const API_CONFIG = {
  // Amadeus API Configuration
  amadeus: {
    baseURL: 'https://api.amadeus.com/v1',
    authURL: 'https://api.amadeus.com/v1/security/oauth2/token',
    clientId: process.env.EXPO_PUBLIC_AMADEUS_CLIENT_ID,
    clientSecret: process.env.EXPO_PUBLIC_AMADEUS_CLIENT_SECRET,
    endpoints: {
      hotels: {
        search: '/shopping/hotel-offers',
        details: '/shopping/hotel-offers/by-hotel',
        book: '/booking/hotel-bookings'
      },
      flights: {
        search: '/shopping/flight-offers-search',
        price: '/shopping/flight-offers/pricing',
        book: '/booking/flight-orders'
      }
    }
  },

  // Booking.com API Configuration (via RapidAPI)
  booking: {
    baseURL: 'https://booking-com15.p.rapidapi.com/api/v1',
    rapidAPIKey: process.env.EXPO_PUBLIC_BOOKING_RAPIDAPI_KEY,
    rapidAPIHost: 'booking-com15.p.rapidapi.com',
    endpoints: {
      hotels: {
        search: '/hotels/searchHotels',
        details: '/hotels/getHotelDetails',
        photos: '/hotels/getHotelPhotos',
        reviews: '/hotels/getHotelReviews'
      },
      destinations: {
        search: '/hotels/searchDestination'
      }
    }
  },

  // Skyscanner API Configuration (via RapidAPI)
  skyscanner: {
    baseURL: 'https://sky-scanner3.p.rapidapi.com/flights',
    rapidAPIKey: process.env.EXPO_PUBLIC_SKYSCANNER_RAPIDAPI_KEY,
    rapidAPIHost: 'sky-scanner3.p.rapidapi.com',
    endpoints: {
      searchAirports: '/search-airports',
      searchFlights: '/search-multi-city',
      priceCalendar: '/price-calendar'
    }
  },

  // Common configuration
  common: {
    timeout: 30000,
    retryAttempts: 3,
    cacheTimeout: 300000, // 5 minutes
  }
};

export const API_HEADERS = {
  amadeus: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  rapidAPI: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': process.env.EXPO_PUBLIC_RAPIDAPI_KEY,
    'X-RapidAPI-Host': ''
  }
};