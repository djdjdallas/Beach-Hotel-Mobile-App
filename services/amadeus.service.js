import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

class AmadeusService {
  constructor() {
    this.config = API_CONFIG.amadeus;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    const now = new Date().getTime();
    
    if (this.accessToken && this.tokenExpiry && now < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(this.config.authURL, 
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = now + (response.data.expires_in * 1000);
      
      await AsyncStorage.setItem('amadeus_token', JSON.stringify({
        token: this.accessToken,
        expiry: this.tokenExpiry
      }));

      return this.accessToken;
    } catch (error) {
      console.error('Amadeus authentication error:', error);
      throw new Error('Failed to authenticate with Amadeus API');
    }
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.config.baseURL}${endpoint}`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: API_CONFIG.common.timeout
      });

      return response.data;
    } catch (error) {
      console.error('Amadeus API request error:', error);
      throw this.handleError(error);
    }
  }

  async searchHotels({ cityCode, checkIn, checkOut, adults = 1, radius = 50, radiusUnit = 'KM' }) {
    const endpoint = this.config.endpoints.hotels.search;
    const params = {
      cityCode,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      radius,
      radiusUnit,
      includeClosed: false,
      bestRateOnly: true,
      view: 'FULL',
      sort: 'PRICE'
    };

    const data = await this.makeRequest(endpoint, params);
    return this.transformHotelData(data.data);
  }

  async getHotelDetails(hotelId, checkIn, checkOut, adults = 1) {
    const endpoint = this.config.endpoints.hotels.details;
    const params = {
      hotelId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults
    };

    const data = await this.makeRequest(endpoint, params);
    return this.transformHotelDetails(data.data);
  }

  async searchFlights({ origin, destination, departureDate, returnDate, adults = 1, travelClass = 'ECONOMY' }) {
    const endpoint = this.config.endpoints.flights.search;
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults,
      travelClass,
      nonStop: false,
      currencyCode: 'USD',
      max: 50
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    const data = await this.makeRequest(endpoint, params);
    return this.transformFlightData(data.data);
  }

  transformHotelData(hotels) {
    return hotels.map(hotel => ({
      id: hotel.hotel.hotelId,
      name: hotel.hotel.name,
      address: hotel.hotel.address,
      location: {
        latitude: hotel.hotel.latitude,
        longitude: hotel.hotel.longitude
      },
      rating: hotel.hotel.rating,
      amenities: hotel.hotel.amenities || [],
      offers: hotel.offers.map(offer => ({
        id: offer.id,
        price: {
          amount: offer.price.total,
          currency: offer.price.currency
        },
        room: {
          type: offer.room.typeEstimated?.category || 'Standard',
          beds: offer.room.typeEstimated?.beds || 1,
          bedType: offer.room.typeEstimated?.bedType || 'Unknown'
        }
      }))
    }));
  }

  transformHotelDetails(hotelData) {
    const hotel = hotelData[0];
    return {
      id: hotel.hotel.hotelId,
      name: hotel.hotel.name,
      description: hotel.hotel.description?.text,
      address: hotel.hotel.address,
      contact: hotel.hotel.contact,
      location: {
        latitude: hotel.hotel.latitude,
        longitude: hotel.hotel.longitude
      },
      rating: hotel.hotel.rating,
      amenities: hotel.hotel.amenities || [],
      media: hotel.hotel.media || [],
      offers: hotel.offers
    };
  }

  transformFlightData(flights) {
    return flights.map(flight => ({
      id: flight.id,
      source: flight.source,
      price: {
        total: flight.price.total,
        currency: flight.price.currency,
        base: flight.price.base,
        fees: flight.price.fees
      },
      itineraries: flight.itineraries.map(itinerary => ({
        duration: itinerary.duration,
        segments: itinerary.segments.map(segment => ({
          departure: {
            iataCode: segment.departure.iataCode,
            terminal: segment.departure.terminal,
            at: segment.departure.at
          },
          arrival: {
            iataCode: segment.arrival.iataCode,
            terminal: segment.arrival.terminal,
            at: segment.arrival.at
          },
          carrierCode: segment.carrierCode,
          number: segment.number,
          aircraft: segment.aircraft,
          duration: segment.duration,
          numberOfStops: segment.numberOfStops
        }))
      }))
    }));
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          this.accessToken = null;
          this.tokenExpiry = null;
          return new Error('Authentication failed. Please check your credentials.');
        case 400:
          return new Error(data.errors?.[0]?.detail || 'Invalid request parameters');
        case 404:
          return new Error('No results found');
        case 429:
          return new Error('Rate limit exceeded. Please try again later.');
        default:
          return new Error(data.errors?.[0]?.detail || 'An error occurred');
      }
    }
    
    return new Error('Network error. Please check your connection.');
  }
}

export default new AmadeusService();