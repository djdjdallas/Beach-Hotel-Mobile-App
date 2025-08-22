/**
 * Base Booking Service Interface
 * Provides a unified interface for all booking providers
 */

export class BaseBookingService {
  constructor(apiKey, apiSecret, environment = 'sandbox') {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.environment = environment;
    this.baseUrl = this.getBaseUrl();
  }

  getBaseUrl() {
    throw new Error('getBaseUrl must be implemented by subclasses');
  }

  async authenticate() {
    throw new Error('authenticate must be implemented by subclasses');
  }

  // Flight methods
  async searchFlights(searchParams) {
    throw new Error('searchFlights must be implemented by subclasses');
  }

  async getFlightDetails(flightId) {
    throw new Error('getFlightDetails must be implemented by subclasses');
  }

  async bookFlight(flightId, passengerDetails) {
    throw new Error('bookFlight must be implemented by subclasses');
  }

  // Hotel methods
  async searchHotels(searchParams) {
    throw new Error('searchHotels must be implemented by subclasses');
  }

  async getHotelDetails(hotelId) {
    throw new Error('getHotelDetails must be implemented by subclasses');
  }

  async bookHotel(hotelId, guestDetails) {
    throw new Error('bookHotel must be implemented by subclasses');
  }

  // Activity methods
  async searchActivities(searchParams) {
    throw new Error('searchActivities must be implemented by subclasses');
  }

  async getActivityDetails(activityId) {
    throw new Error('getActivityDetails must be implemented by subclasses');
  }

  async bookActivity(activityId, participantDetails) {
    throw new Error('bookActivity must be implemented by subclasses');
  }

  // Common helper methods
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }

  handleError(error) {
    console.error(`${this.constructor.name} Error:`, error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(`Bad Request: ${data.message || 'Invalid request parameters'}`);
        case 401:
          throw new Error('Authentication failed. Please check your API credentials.');
        case 403:
          throw new Error('Access forbidden. Please check your API permissions.');
        case 404:
          throw new Error('Resource not found.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        case 500:
        case 502:
        case 503:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(`API Error: ${data.message || 'Unknown error occurred'}`);
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw error;
    }
  }
}

// Common search parameter interfaces
export const FlightSearchParams = {
  origin: '',           // IATA code
  destination: '',      // IATA code
  departureDate: '',    // YYYY-MM-DD
  returnDate: '',       // YYYY-MM-DD (optional for one-way)
  adults: 1,
  children: 0,
  infants: 0,
  travelClass: 'ECONOMY', // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
  nonStop: false,
  maxPrice: null,
  currency: 'USD'
};

export const HotelSearchParams = {
  cityCode: '',         // City IATA code or coordinates
  checkInDate: '',      // YYYY-MM-DD
  checkOutDate: '',     // YYYY-MM-DD
  adults: 1,
  rooms: 1,
  priceRange: {
    min: null,
    max: null
  },
  ratings: [],         // Array of ratings (1-5)
  amenities: [],       // Array of amenity codes
  currency: 'USD'
};

export const ActivitySearchParams = {
  destination: '',      // City or location
  date: '',            // YYYY-MM-DD
  adults: 1,
  children: 0,
  categories: [],      // Array of category codes
  priceRange: {
    min: null,
    max: null
  },
  duration: null,      // Duration in hours
  currency: 'USD'
};