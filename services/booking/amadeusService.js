import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseBookingService } from './baseBookingService';

/**
 * Amadeus API Service
 * Implements real integration with Amadeus for flights and hotels
 */
export class AmadeusService extends BaseBookingService {
  constructor(apiKey, apiSecret, environment = 'test') {
    super(apiKey, apiSecret, environment);
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  getBaseUrl() {
    return this.environment === 'production'
      ? 'https://api.amadeus.com/v2'
      : 'https://test.api.amadeus.com/v2';
  }

  async authenticate() {
    try {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.accessToken;
      }

      const authUrl = this.environment === 'production'
        ? 'https://api.amadeus.com/v1/security/oauth2/token'
        : 'https://test.api.amadeus.com/v1/security/oauth2/token';

      const response = await axios.post(authUrl, 
        `grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.apiSecret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Set token expiry with 5 minute buffer
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in - 300) * 1000);

      // Store token in AsyncStorage for persistence
      await AsyncStorage.setItem('amadeus_token', JSON.stringify({
        token: this.accessToken,
        expiry: this.tokenExpiry.toISOString()
      }));

      return this.accessToken;
    } catch (error) {
      this.handleError(error);
    }
  }

  async makeRequest(endpoint, params = {}) {
    try {
      await this.authenticate();
      
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Flight Search Implementation
  async searchFlights(searchParams) {
    try {
      const params = {
        originLocationCode: searchParams.origin,
        destinationLocationCode: searchParams.destination,
        departureDate: searchParams.departureDate,
        adults: searchParams.adults,
        children: searchParams.children || undefined,
        infants: searchParams.infants || undefined,
        travelClass: searchParams.travelClass,
        nonStop: searchParams.nonStop,
        currencyCode: searchParams.currency,
        max: 50 // Maximum results
      };

      if (searchParams.returnDate) {
        params.returnDate = searchParams.returnDate;
      }

      if (searchParams.maxPrice) {
        params.maxPrice = searchParams.maxPrice;
      }

      const data = await this.makeRequest('/shopping/flight-offers', params);

      // Transform Amadeus response to our standard format
      return this.transformFlightResults(data.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  transformFlightResults(amadeusFlights) {
    return amadeusFlights.map(offer => ({
      id: offer.id,
      provider: 'Amadeus',
      price: {
        amount: parseFloat(offer.price.total),
        currency: offer.price.currency,
        display: this.formatPrice(offer.price.total, offer.price.currency)
      },
      itineraries: offer.itineraries.map(itinerary => ({
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
          aircraft: segment.aircraft.code,
          duration: segment.duration,
          numberOfStops: segment.numberOfStops || 0
        }))
      })),
      travelerPricings: offer.travelerPricings,
      validatingAirlineCodes: offer.validatingAirlineCodes,
      bookingRequirements: offer.bookingRequirements
    }));
  }

  async getFlightDetails(flightId) {
    try {
      // In real implementation, you might need to store offer details
      // For now, return mock enhanced details
      return {
        id: flightId,
        provider: 'Amadeus',
        // Add more detailed information here
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async bookFlight(flightId, passengerDetails) {
    // This would implement actual booking logic
    // For security reasons, this typically requires additional authentication
    throw new Error('Flight booking requires additional merchant authentication');
  }

  // Hotel Search Implementation
  async searchHotels(searchParams) {
    try {
      // First, get hotel list by city
      const hotelListParams = {
        cityCode: searchParams.cityCode,
        radius: 50,
        radiusUnit: 'KM',
        hotelSource: 'ALL'
      };

      const hotelListData = await this.makeRequest('/reference-data/locations/hotels/by-city', hotelListParams);
      
      if (!hotelListData.data || hotelListData.data.length === 0) {
        return [];
      }

      // Get hotel IDs (limit to first 20 for performance)
      const hotelIds = hotelListData.data.slice(0, 20).map(hotel => hotel.hotelId).join(',');

      // Now get offers for these hotels
      const offerParams = {
        hotelIds: hotelIds,
        adults: searchParams.adults,
        checkInDate: searchParams.checkInDate,
        checkOutDate: searchParams.checkOutDate,
        roomQuantity: searchParams.rooms,
        currency: searchParams.currency,
        paymentPolicy: 'NONE',
        bestRateOnly: true
      };

      if (searchParams.priceRange.min || searchParams.priceRange.max) {
        offerParams.priceRange = `${searchParams.priceRange.min || 0}-${searchParams.priceRange.max || 99999}`;
      }

      const offerData = await this.makeRequest('/shopping/hotel-offers', offerParams);

      // Transform results
      return this.transformHotelResults(offerData.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  transformHotelResults(amadeusHotels) {
    return amadeusHotels.map(hotel => ({
      id: hotel.hotel.hotelId,
      provider: 'Amadeus',
      name: hotel.hotel.name,
      type: hotel.hotel.type,
      chainCode: hotel.hotel.chainCode,
      location: {
        latitude: hotel.hotel.latitude,
        longitude: hotel.hotel.longitude,
        address: hotel.hotel.address,
        cityName: hotel.hotel.cityName,
        cityCode: hotel.hotel.cityCode,
        countryCode: hotel.hotel.countryCode
      },
      rating: hotel.hotel.rating,
      amenities: hotel.hotel.amenities || [],
      offers: hotel.offers.map(offer => ({
        id: offer.id,
        checkInDate: offer.checkInDate,
        checkOutDate: offer.checkOutDate,
        roomType: offer.room.typeEstimated?.category || 'Standard',
        beds: offer.room.typeEstimated?.beds,
        bedType: offer.room.typeEstimated?.bedType,
        description: offer.room.description?.text,
        guests: offer.guests,
        price: {
          amount: parseFloat(offer.price.total),
          currency: offer.price.currency,
          display: this.formatPrice(offer.price.total, offer.price.currency),
          breakdown: offer.price.variations?.changes || []
        },
        policies: {
          cancellation: offer.policies?.cancellation,
          paymentType: offer.policies?.paymentType
        }
      }))
    }));
  }

  async getHotelDetails(hotelId) {
    try {
      const data = await this.makeRequest(`/reference-data/locations/hotels/by-hotels`, {
        hotelIds: hotelId
      });

      if (!data.data || data.data.length === 0) {
        throw new Error('Hotel not found');
      }

      return this.transformHotelDetails(data.data[0]);
    } catch (error) {
      this.handleError(error);
    }
  }

  transformHotelDetails(hotelData) {
    return {
      id: hotelData.hotelId,
      provider: 'Amadeus',
      name: hotelData.name,
      description: hotelData.description,
      chainCode: hotelData.chainCode,
      brandCode: hotelData.brandCode,
      location: {
        latitude: hotelData.geoCode.latitude,
        longitude: hotelData.geoCode.longitude,
        address: hotelData.address,
        distance: hotelData.distance
      },
      contact: hotelData.contact,
      amenities: hotelData.amenities || [],
      media: hotelData.media || []
    };
  }

  async bookHotel(hotelId, guestDetails) {
    // This would implement actual booking logic
    throw new Error('Hotel booking requires additional merchant authentication');
  }

  // Activity methods (Amadeus has limited activity support)
  async searchActivities(searchParams) {
    try {
      // Amadeus Tours and Activities API
      const params = {
        latitude: searchParams.latitude,
        longitude: searchParams.longitude,
        radius: 20
      };

      const data = await this.makeRequest('/shopping/activities', params);
      return this.transformActivityResults(data.data);
    } catch (error) {
      // Fallback to mock data if API doesn't support activities
      console.warn('Amadeus activities API not available, returning empty results');
      return [];
    }
  }

  transformActivityResults(activities) {
    return activities.map(activity => ({
      id: activity.id,
      provider: 'Amadeus',
      name: activity.name,
      shortDescription: activity.shortDescription,
      geoCode: activity.geoCode,
      rating: activity.rating,
      pictures: activity.pictures,
      bookingLink: activity.bookingLink,
      price: activity.price ? {
        amount: parseFloat(activity.price.amount),
        currency: activity.price.currencyCode,
        display: this.formatPrice(activity.price.amount, activity.price.currencyCode)
      } : null
    }));
  }

  async getActivityDetails(activityId) {
    try {
      const data = await this.makeRequest(`/shopping/activities/${activityId}`);
      return this.transformActivityDetails(data.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  transformActivityDetails(activity) {
    return {
      id: activity.id,
      provider: 'Amadeus',
      name: activity.name,
      description: activity.description,
      shortDescription: activity.shortDescription,
      geoCode: activity.geoCode,
      rating: activity.rating,
      pictures: activity.pictures,
      minimumDuration: activity.minimumDuration,
      content: activity.content
    };
  }

  async bookActivity(activityId, participantDetails) {
    throw new Error('Activity booking not yet implemented for Amadeus');
  }
}