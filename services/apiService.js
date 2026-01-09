import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  mockCategories,
  mockPopularDestinations,
  mockHotels,
  mockRestaurants,
  mockAttractions,
  mockShopping,
  mockFavorites,
  mockTours,
  mockEvents,
  simulateApiDelay,
  getMockDataByCategory,
} from './mockData';
import travelService from './travel.service';
import amadeusService from './amadeus.service';
import bookingService from './booking.service';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.roamly.com';
const USE_MOCK_DATA = true; // Toggle this for development
const USE_EXTERNAL_APIS = true; // Toggle to use Amadeus/Booking.com APIs

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Home Screen Data
  async getPopularDestinations() {
    try {
      if (USE_MOCK_DATA) {
        return await simulateApiDelay(mockPopularDestinations);
      }
      const response = await api.get('/destinations/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      // Fallback to mock data on error
      return mockPopularDestinations;
    }
  }

  async getCategories() {
    try {
      if (USE_MOCK_DATA) {
        return await simulateApiDelay(mockCategories);
      }
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return mockCategories;
    }
  }

  async searchHotels(params) {
    try {
      if (USE_MOCK_DATA) {
        // Try real API first if we have location params
        if (params.latitude && params.longitude) {
          try {
            const hotels = await travelService.searchHotels(
              params.latitude,
              params.longitude,
              params.checkinDate,
              params.checkoutDate,
              params.adults
            );
            if (hotels && hotels.length > 0) {
              return hotels;
            }
          } catch (error) {
            console.log('Travel API failed, using mock data');
          }
        }
        return await simulateApiDelay(mockHotels);
      }
      const response = await api.get('/hotels/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      return mockHotels;
    }
  }

  async searchRestaurants(params) {
    try {
      if (USE_MOCK_DATA) {
        return await simulateApiDelay(mockRestaurants);
      }
      const response = await api.get('/restaurants/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching restaurants:', error);
      return mockRestaurants;
    }
  }

  async searchAttractions(params) {
    try {
      if (USE_MOCK_DATA) {
        return await simulateApiDelay(mockAttractions);
      }
      const response = await api.get('/attractions/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching attractions:', error);
      return mockAttractions;
    }
  }

  async searchShopping(params) {
    try {
      if (USE_MOCK_DATA) {
        return await simulateApiDelay(mockShopping);
      }
      const response = await api.get('/shopping/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching shopping:', error);
      return mockShopping;
    }
  }

  // Favorites Management
  async getFavorites() {
    try {
      if (USE_MOCK_DATA) {
        // Get favorites from AsyncStorage for mock mode
        const stored = await AsyncStorage.getItem('mockFavorites');
        return stored ? JSON.parse(stored) : mockFavorites;
      }
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return mockFavorites;
    }
  }

  async addFavorite(item) {
    try {
      if (USE_MOCK_DATA) {
        // Store in AsyncStorage for mock mode
        const stored = await AsyncStorage.getItem('mockFavorites');
        const favorites = stored ? JSON.parse(stored) : mockFavorites;
        const newFavorite = {
          id: Date.now().toString(),
          itemId: item.id,
          ...item,
          type: item.type || 'general',
        };
        favorites.push(newFavorite);
        await AsyncStorage.setItem('mockFavorites', JSON.stringify(favorites));
        return newFavorite;
      }
      const response = await api.post('/favorites', item);
      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(id) {
    try {
      if (USE_MOCK_DATA) {
        // Remove from AsyncStorage for mock mode
        const stored = await AsyncStorage.getItem('mockFavorites');
        let favorites = stored ? JSON.parse(stored) : mockFavorites;
        favorites = favorites.filter(fav => fav.id !== id);
        await AsyncStorage.setItem('mockFavorites', JSON.stringify(favorites));
        return { success: true };
      }
      const response = await api.delete(`/favorites/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  // Tours and Events
  async getTours(params) {
    try {
      if (USE_MOCK_DATA) {
        return await simulateApiDelay(mockTours);
      }
      const response = await api.get('/tours', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      return mockTours;
    }
  }

  async getEvents(params) {
    try {
      if (USE_MOCK_DATA) {
        return await simulateApiDelay(mockEvents);
      }
      const response = await api.get('/events', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return mockEvents;
    }
  }

  // Flight Search
  async searchFlights(params) {
    try {
      if (USE_MOCK_DATA) {
        // Try real API first if we have required params
        if (params.origin && params.destination && params.departureDate) {
          try {
            const flights = await amadeusService.searchFlights(
              params.origin,
              params.destination,
              params.departureDate,
              params.adults || 1
            );
            return flights;
          } catch (error) {
            console.log('Amadeus API failed, using mock data');
            return await simulateApiDelay([
              {
                id: 'f1',
                airline: 'American Airlines',
                flightNumber: 'AA123',
                origin: params.origin,
                destination: params.destination,
                departureTime: '08:00',
                arrivalTime: '11:30',
                duration: '3h 30m',
                price: 299,
                currency: 'USD',
              },
              {
                id: 'f2',
                airline: 'Delta Airlines',
                flightNumber: 'DL456',
                origin: params.origin,
                destination: params.destination,
                departureTime: '14:15',
                arrivalTime: '17:45',
                duration: '3h 30m',
                price: 325,
                currency: 'USD',
              },
            ]);
          }
        }
        return [];
      }
      const response = await api.get('/flights/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      return [];
    }
  }

  // Hotel Details
  async getHotelDetails(hotelId) {
    try {
      const response = await api.get(`/hotels/${hotelId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      throw error;
    }
  }

  // Reviews
  async getReviews(type, id) {
    try {
      const response = await api.get(`/reviews/${type}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async addReview(type, id, review) {
    try {
      const response = await api.post(`/reviews/${type}/${id}`, review);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Booking
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookings() {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  // Location-based recommendations
  async getLocationRecommendations(latitude, longitude, type) {
    try {
      const response = await api.get('/recommendations/location', {
        params: { latitude, longitude, type }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching location recommendations:', error);
      throw error;
    }
  }

  // Generic search
  async search(query, filters = {}) {
    try {
      const response = await api.get('/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  }
}

export default new ApiService();