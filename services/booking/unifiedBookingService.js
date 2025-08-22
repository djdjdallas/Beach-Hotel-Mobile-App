import { AmadeusService } from './amadeusService';
import {
  BookingComMockService,
  ExpediaMockService,
  GetYourGuideMockService,
  ViatorMockService,
  SkyscannerMockService
} from './mockBookingService';

/**
 * Unified Booking Service
 * Aggregates results from multiple travel providers
 */
export class UnifiedBookingService {
  constructor() {
    this.providers = {
      flights: [],
      hotels: [],
      activities: []
    };
    
    this.initializeProviders();
  }

  initializeProviders() {
    // Initialize Amadeus if credentials are available
    if (process.env.EXPO_PUBLIC_AMADEUS_API_KEY && process.env.EXPO_PUBLIC_AMADEUS_API_SECRET) {
      const amadeus = new AmadeusService(
        process.env.EXPO_PUBLIC_AMADEUS_API_KEY,
        process.env.EXPO_PUBLIC_AMADEUS_API_SECRET,
        process.env.EXPO_PUBLIC_AMADEUS_ENV || 'test'
      );
      this.providers.flights.push(amadeus);
      this.providers.hotels.push(amadeus);
    }

    // Initialize mock providers
    const skyscanner = new SkyscannerMockService();
    const expedia = new ExpediaMockService();
    const bookingCom = new BookingComMockService();
    const getYourGuide = new GetYourGuideMockService();
    const viator = new ViatorMockService();

    // Add flight providers
    this.providers.flights.push(skyscanner, expedia);

    // Add hotel providers
    this.providers.hotels.push(bookingCom, expedia);

    // Add activity providers
    this.providers.activities.push(getYourGuide, viator);
  }

  /**
   * Search flights across all providers
   */
  async searchFlights(searchParams) {
    try {
      const results = await Promise.allSettled(
        this.providers.flights.map(provider => 
          provider.searchFlights(searchParams)
        )
      );

      const allFlights = [];
      const errors = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allFlights.push(...result.value);
        } else if (result.status === 'rejected') {
          errors.push({
            provider: this.providers.flights[index].constructor.name,
            error: result.reason.message
          });
        }
      });

      // Sort by price and add comparison data
      const sortedFlights = this.addPriceComparison(
        allFlights.sort((a, b) => a.price.amount - b.price.amount)
      );

      return {
        flights: sortedFlights,
        errors: errors,
        totalResults: sortedFlights.length,
        providers: this.providers.flights.length
      };
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }

  /**
   * Search hotels across all providers
   */
  async searchHotels(searchParams) {
    try {
      const results = await Promise.allSettled(
        this.providers.hotels.map(provider => 
          provider.searchHotels(searchParams)
        )
      );

      const allHotels = [];
      const errors = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allHotels.push(...result.value);
        } else if (result.status === 'rejected') {
          errors.push({
            provider: this.providers.hotels[index].constructor.name,
            error: result.reason.message
          });
        }
      });

      // Group hotels by similar properties and find best prices
      const groupedHotels = this.groupSimilarHotels(allHotels);
      const sortedHotels = groupedHotels.sort((a, b) => b.rating - a.rating);

      return {
        hotels: sortedHotels,
        errors: errors,
        totalResults: sortedHotels.length,
        providers: this.providers.hotels.length
      };
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  }

  /**
   * Search activities across all providers
   */
  async searchActivities(searchParams) {
    try {
      const results = await Promise.allSettled(
        this.providers.activities.map(provider => 
          provider.searchActivities(searchParams)
        )
      );

      const allActivities = [];
      const errors = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allActivities.push(...result.value);
        } else if (result.status === 'rejected') {
          errors.push({
            provider: this.providers.activities[index].constructor.name,
            error: result.reason.message
          });
        }
      });

      // Sort by rating and add comparison data
      const sortedActivities = this.addPriceComparison(
        allActivities.sort((a, b) => b.rating - a.rating)
      );

      return {
        activities: sortedActivities,
        errors: errors,
        totalResults: sortedActivities.length,
        providers: this.providers.activities.length
      };
    } catch (error) {
      console.error('Error searching activities:', error);
      throw error;
    }
  }

  /**
   * Get detailed information for a specific item
   */
  async getDetails(type, id, provider) {
    try {
      const providerService = this.findProvider(type, provider);
      if (!providerService) {
        throw new Error(`Provider ${provider} not found for ${type}`);
      }

      switch (type) {
        case 'flight':
          return await providerService.getFlightDetails(id);
        case 'hotel':
          return await providerService.getHotelDetails(id);
        case 'activity':
          return await providerService.getActivityDetails(id);
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    } catch (error) {
      console.error(`Error getting ${type} details:`, error);
      throw error;
    }
  }

  /**
   * Book a specific item
   */
  async book(type, id, provider, details) {
    try {
      const providerService = this.findProvider(type, provider);
      if (!providerService) {
        throw new Error(`Provider ${provider} not found for ${type}`);
      }

      switch (type) {
        case 'flight':
          return await providerService.bookFlight(id, details);
        case 'hotel':
          return await providerService.bookHotel(id, details);
        case 'activity':
          return await providerService.bookActivity(id, details);
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    } catch (error) {
      console.error(`Error booking ${type}:`, error);
      throw error;
    }
  }

  /**
   * Helper method to find a specific provider
   */
  findProvider(type, providerName) {
    const providerList = type === 'flight' ? this.providers.flights :
                        type === 'hotel' ? this.providers.hotels :
                        type === 'activity' ? this.providers.activities : [];

    return providerList.find(p => 
      p.constructor.name.toLowerCase().includes(providerName.toLowerCase()) ||
      p.provider === providerName
    );
  }

  /**
   * Add price comparison data to results
   */
  addPriceComparison(items) {
    if (items.length === 0) return items;

    const prices = items.map(item => item.price.amount);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    return items.map(item => ({
      ...item,
      priceComparison: {
        isLowest: item.price.amount === minPrice,
        isHighest: item.price.amount === maxPrice,
        percentFromAverage: ((item.price.amount - avgPrice) / avgPrice * 100).toFixed(0),
        savings: minPrice < item.price.amount ? item.price.amount - minPrice : 0
      }
    }));
  }

  /**
   * Group similar hotels from different providers
   */
  groupSimilarHotels(hotels) {
    const grouped = {};

    hotels.forEach(hotel => {
      // Simple grouping by name similarity
      const key = hotel.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (!grouped[key]) {
        grouped[key] = {
          ...hotel,
          providers: [hotel.provider],
          priceRange: {
            min: hotel.offers[0]?.price.amount || 0,
            max: hotel.offers[0]?.price.amount || 0
          },
          allOffers: hotel.offers
        };
      } else {
        grouped[key].providers.push(hotel.provider);
        grouped[key].allOffers.push(...hotel.offers);
        
        const price = hotel.offers[0]?.price.amount || 0;
        if (price < grouped[key].priceRange.min) {
          grouped[key].priceRange.min = price;
        }
        if (price > grouped[key].priceRange.max) {
          grouped[key].priceRange.max = price;
        }
      }
    });

    return Object.values(grouped);
  }

  /**
   * Get available providers for each service type
   */
  getAvailableProviders() {
    return {
      flights: this.providers.flights.map(p => ({
        name: p.constructor.name,
        provider: p.provider,
        status: 'active'
      })),
      hotels: this.providers.hotels.map(p => ({
        name: p.constructor.name,
        provider: p.provider,
        status: 'active'
      })),
      activities: this.providers.activities.map(p => ({
        name: p.constructor.name,
        provider: p.provider,
        status: 'active'
      }))
    };
  }
}

// Export singleton instance
export default new UnifiedBookingService();