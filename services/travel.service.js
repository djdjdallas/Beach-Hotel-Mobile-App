import amadeusService from './amadeus.service';
import bookingService from './booking.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

class TravelService {
  constructor() {
    this.cachePrefix = 'travel_cache_';
    this.cacheExpiry = 300000; // 5 minutes
  }

  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(this.cachePrefix + key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.cacheExpiry) {
          return data;
        }
      }
    } catch (error) {
      console.log('Cache read error:', error);
    }
    return null;
  }

  async setCachedData(key, data) {
    try {
      await AsyncStorage.setItem(
        this.cachePrefix + key,
        JSON.stringify({
          data,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.log('Cache write error:', error);
    }
  }

  async searchDestinations(query) {
    const cacheKey = `destinations_${query}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const results = await bookingService.searchDestinations(query);
      await this.setCachedData(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Destination search error:', error);
      throw error;
    }
  }

  async searchHotels({
    location,
    checkIn,
    checkOut,
    adults = 1,
    children = 0,
    rooms = 1,
    priceMin,
    priceMax,
    rating,
    amenities,
    source = 'both'
  }) {
    const results = {
      amadeus: [],
      booking: [],
      combined: []
    };

    const searchPromises = [];

    if (source === 'amadeus' || source === 'both') {
      if (location.cityCode) {
        searchPromises.push(
          amadeusService.searchHotels({
            cityCode: location.cityCode,
            checkIn,
            checkOut,
            adults
          }).then(data => {
            results.amadeus = data;
          }).catch(error => {
            console.error('Amadeus search error:', error);
            results.amadeus = [];
          })
        );
      }
    }

    if (source === 'booking' || source === 'both') {
      if (location.destId) {
        searchPromises.push(
          bookingService.searchHotels({
            destId: location.destId,
            destType: location.destType || 'city',
            checkIn,
            checkOut,
            adults,
            children,
            rooms,
            priceMin,
            priceMax,
            reviewScoreMin: rating,
            facilities: amenities
          }).then(data => {
            results.booking = data.results;
          }).catch(error => {
            console.error('Booking.com search error:', error);
            results.booking = [];
          })
        );
      }
    }

    await Promise.all(searchPromises);

    results.combined = this.combineHotelResults(results.amadeus, results.booking);
    return results;
  }

  async getHotelDetails(hotelId, source, checkIn, checkOut, adults = 1, children = 0) {
    try {
      if (source === 'amadeus') {
        return await amadeusService.getHotelDetails(hotelId, checkIn, checkOut, adults);
      } else if (source === 'booking') {
        const details = await bookingService.getHotelDetails(hotelId, checkIn, checkOut, adults, children);
        const photos = await bookingService.getHotelPhotos(hotelId);
        const reviews = await bookingService.getHotelReviews(hotelId);
        
        return {
          ...details,
          photos,
          reviews: reviews.reviews
        };
      }
    } catch (error) {
      console.error('Hotel details error:', error);
      throw error;
    }
  }

  async searchFlights({
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    travelClass = 'ECONOMY'
  }) {
    const cacheKey = `flights_${origin}_${destination}_${departureDate}_${returnDate}_${adults}_${travelClass}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const results = await amadeusService.searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        travelClass
      });
      
      await this.setCachedData(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  }

  combineHotelResults(amadeusHotels = [], bookingHotels = []) {
    const combined = [];
    
    const amadeusFormatted = amadeusHotels.map(hotel => ({
      ...hotel,
      source: 'amadeus',
      combinedRating: hotel.rating || 0,
      combinedPrice: hotel.offers?.[0]?.price?.amount || 0
    }));

    const bookingFormatted = bookingHotels.map(hotel => ({
      ...hotel,
      source: 'booking',
      combinedRating: hotel.rating?.score || 0,
      combinedPrice: hotel.price?.amount || 0
    }));

    combined.push(...amadeusFormatted, ...bookingFormatted);

    return combined.sort((a, b) => {
      const scoreA = (a.combinedRating / 10) * 0.4 + (1 / (a.combinedPrice || 1)) * 1000 * 0.6;
      const scoreB = (b.combinedRating / 10) * 0.4 + (1 / (b.combinedPrice || 1)) * 1000 * 0.6;
      return scoreB - scoreA;
    });
  }

  calculateHotelScore(hotel) {
    const ratingWeight = 0.4;
    const priceWeight = 0.3;
    const amenitiesWeight = 0.2;
    const locationWeight = 0.1;

    const normalizedRating = (hotel.rating || 0) / 10;
    const normalizedPrice = hotel.price ? (1 / hotel.price.amount) * 1000 : 0;
    const amenitiesScore = hotel.amenities ? hotel.amenities.length / 50 : 0;
    const locationScore = hotel.location?.distance ? (1 / (hotel.location.distance + 1)) : 0.5;

    return (
      normalizedRating * ratingWeight +
      normalizedPrice * priceWeight +
      amenitiesScore * amenitiesWeight +
      locationScore * locationWeight
    );
  }

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Clear cache error:', error);
    }
  }
}

export default new TravelService();