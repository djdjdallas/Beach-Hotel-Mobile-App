import { BaseBookingService } from './baseBookingService';

/**
 * Mock Booking Service
 * Provides realistic mock data for various travel providers
 */
export class MockBookingService extends BaseBookingService {
  constructor(provider, apiKey, apiSecret) {
    super(apiKey, apiSecret, 'mock');
    this.provider = provider;
  }

  getBaseUrl() {
    return 'https://mock-api.example.com';
  }

  async authenticate() {
    // Mock authentication - always succeeds
    return 'mock-token-' + this.provider;
  }

  // Generate realistic mock data with some randomization
  generateMockFlights(searchParams) {
    const airlines = [
      { code: 'AA', name: 'American Airlines' },
      { code: 'DL', name: 'Delta Airlines' },
      { code: 'UA', name: 'United Airlines' },
      { code: 'BA', name: 'British Airways' },
      { code: 'LH', name: 'Lufthansa' },
      { code: 'AF', name: 'Air France' }
    ];

    const flights = [];
    const basePrice = Math.random() * 500 + 200;

    for (let i = 0; i < 10; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const departureTime = new Date(searchParams.departureDate);
      departureTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      
      const duration = Math.floor(Math.random() * 8 + 2) * 60; // 2-10 hours
      const arrivalTime = new Date(departureTime.getTime() + duration * 60000);
      
      const price = basePrice + (Math.random() * 300 - 150);
      const stops = Math.random() > 0.7 ? 0 : Math.floor(Math.random() * 2 + 1);

      flights.push({
        id: `${this.provider}-flight-${i}`,
        provider: this.provider,
        price: {
          amount: Math.round(price),
          currency: searchParams.currency,
          display: this.formatPrice(price, searchParams.currency)
        },
        itineraries: [{
          duration: `PT${Math.floor(duration / 60)}H${duration % 60}M`,
          segments: [{
            departure: {
              iataCode: searchParams.origin,
              at: departureTime.toISOString()
            },
            arrival: {
              iataCode: searchParams.destination,
              at: arrivalTime.toISOString()
            },
            carrierCode: airline.code,
            number: Math.floor(Math.random() * 9000 + 1000).toString(),
            aircraft: '737',
            duration: `PT${Math.floor(duration / 60)}H${duration % 60}M`,
            numberOfStops: stops
          }]
        }],
        airline: airline.name,
        class: searchParams.travelClass,
        stops: stops
      });
    }

    return flights.sort((a, b) => a.price.amount - b.price.amount);
  }

  generateMockHotels(searchParams) {
    const hotelChains = [
      { name: 'Hilton', rating: 4.5 },
      { name: 'Marriott', rating: 4.3 },
      { name: 'Holiday Inn', rating: 3.8 },
      { name: 'Hyatt', rating: 4.6 },
      { name: 'Best Western', rating: 3.5 },
      { name: 'Sheraton', rating: 4.4 }
    ];

    const amenities = [
      'Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 
      'Room Service', 'Spa', 'Parking', 'Pet Friendly',
      'Business Center', 'Laundry Service', 'Concierge'
    ];

    const hotels = [];
    const nights = Math.ceil((new Date(searchParams.checkOutDate) - new Date(searchParams.checkInDate)) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < 15; i++) {
      const chain = hotelChains[Math.floor(Math.random() * hotelChains.length)];
      const basePrice = Math.random() * 200 + 80;
      const totalPrice = basePrice * nights * searchParams.rooms;
      
      const hotelAmenities = [];
      for (let j = 0; j < Math.floor(Math.random() * 6 + 3); j++) {
        const amenity = amenities[Math.floor(Math.random() * amenities.length)];
        if (!hotelAmenities.includes(amenity)) {
          hotelAmenities.push(amenity);
        }
      }

      hotels.push({
        id: `${this.provider}-hotel-${i}`,
        provider: this.provider,
        name: `${chain.name} ${searchParams.cityCode}`,
        type: 'Hotel',
        location: {
          cityCode: searchParams.cityCode,
          address: `${Math.floor(Math.random() * 9999 + 1)} Main Street`,
          distance: (Math.random() * 10).toFixed(1) + ' km from center'
        },
        rating: (chain.rating + (Math.random() * 0.4 - 0.2)).toFixed(1),
        amenities: hotelAmenities,
        offers: [{
          id: `${this.provider}-offer-${i}`,
          checkInDate: searchParams.checkInDate,
          checkOutDate: searchParams.checkOutDate,
          roomType: ['Standard Room', 'Deluxe Room', 'Suite'][Math.floor(Math.random() * 3)],
          beds: Math.floor(Math.random() * 2 + 1),
          bedType: ['King', 'Queen', 'Twin'][Math.floor(Math.random() * 3)],
          guests: { adults: searchParams.adults },
          price: {
            amount: Math.round(totalPrice),
            currency: searchParams.currency,
            display: this.formatPrice(totalPrice, searchParams.currency),
            perNight: this.formatPrice(basePrice, searchParams.currency)
          },
          policies: {
            cancellation: {
              description: 'Free cancellation until 24 hours before check-in'
            },
            paymentType: 'PAY_LATER'
          }
        }],
        images: [
          'https://via.placeholder.com/400x300?text=Hotel+Image+1',
          'https://via.placeholder.com/400x300?text=Hotel+Image+2',
          'https://via.placeholder.com/400x300?text=Hotel+Image+3'
        ]
      });
    }

    return hotels.sort((a, b) => b.rating - a.rating);
  }

  generateMockActivities(searchParams) {
    const categories = [
      'Sightseeing Tours', 'Adventure', 'Cultural', 'Food & Drink',
      'Nature & Wildlife', 'Water Sports', 'Entertainment', 'Shopping'
    ];

    const activities = [];
    const basePrice = Math.random() * 50 + 30;

    for (let i = 0; i < 20; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const duration = Math.floor(Math.random() * 8 + 1);
      const price = basePrice + (Math.random() * 100 - 50);

      activities.push({
        id: `${this.provider}-activity-${i}`,
        provider: this.provider,
        name: `${category} Experience in ${searchParams.destination}`,
        shortDescription: `Amazing ${duration}-hour ${category.toLowerCase()} experience`,
        category: category,
        duration: `${duration} hours`,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500 + 50),
        price: {
          amount: Math.round(price * searchParams.adults),
          currency: searchParams.currency,
          display: this.formatPrice(price * searchParams.adults, searchParams.currency),
          perPerson: this.formatPrice(price, searchParams.currency)
        },
        images: [
          `https://via.placeholder.com/400x300?text=${category}+Activity`
        ],
        included: [
          'Professional guide',
          'All equipment',
          'Hotel pickup and drop-off'
        ],
        highlights: [
          'Small group experience',
          'Instant confirmation',
          'Mobile ticket accepted'
        ]
      });
    }

    return activities.sort((a, b) => b.rating - a.rating);
  }

  // Implementation of abstract methods
  async searchFlights(searchParams) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.generateMockFlights(searchParams);
  }

  async getFlightDetails(flightId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: flightId,
      provider: this.provider,
      details: 'Detailed flight information would be here',
      aircraft: {
        model: 'Boeing 737-800',
        configuration: '3-3',
        amenities: ['WiFi', 'In-flight Entertainment', 'Power Outlets']
      }
    };
  }

  async bookFlight(flightId, passengerDetails) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      bookingId: `BKG-${Date.now()}`,
      status: 'confirmed',
      flightId: flightId,
      passengers: passengerDetails,
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };
  }

  async searchHotels(searchParams) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return this.generateMockHotels(searchParams);
  }

  async getHotelDetails(hotelId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: hotelId,
      provider: this.provider,
      description: 'Luxury hotel with excellent amenities and service',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      policies: {
        children: 'Children of all ages are welcome',
        pets: 'Pets allowed on request',
        smoking: 'Non-smoking property'
      },
      nearbyAttractions: [
        { name: 'City Center', distance: '2 km' },
        { name: 'Airport', distance: '15 km' },
        { name: 'Beach', distance: '5 km' }
      ]
    };
  }

  async bookHotel(hotelId, guestDetails) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      bookingId: `HTL-${Date.now()}`,
      status: 'confirmed',
      hotelId: hotelId,
      guests: guestDetails,
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };
  }

  async searchActivities(searchParams) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.generateMockActivities(searchParams);
  }

  async getActivityDetails(activityId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: activityId,
      provider: this.provider,
      fullDescription: 'Experience the best of the destination with this amazing tour',
      meetingPoint: 'Hotel lobby or designated meeting point',
      whatToBring: ['Comfortable shoes', 'Camera', 'Sunscreen', 'Water'],
      restrictions: {
        minAge: 5,
        maxGroupSize: 15,
        wheelchairAccessible: true
      },
      cancellationPolicy: 'Free cancellation up to 24 hours before the activity'
    };
  }

  async bookActivity(activityId, participantDetails) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      bookingId: `ACT-${Date.now()}`,
      status: 'confirmed',
      activityId: activityId,
      participants: participantDetails,
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      voucher: 'Digital voucher will be sent to your email'
    };
  }
}

// Create specific mock services for different providers
export class BookingComMockService extends MockBookingService {
  constructor() {
    super('Booking.com', 'mock-key', 'mock-secret');
  }
}

export class ExpediaMockService extends MockBookingService {
  constructor() {
    super('Expedia', 'mock-key', 'mock-secret');
  }
}

export class GetYourGuideMockService extends MockBookingService {
  constructor() {
    super('GetYourGuide', 'mock-key', 'mock-secret');
  }
}

export class ViatorMockService extends MockBookingService {
  constructor() {
    super('Viator', 'mock-key', 'mock-secret');
  }
}

export class SkyscannerMockService extends MockBookingService {
  constructor() {
    super('Skyscanner', 'mock-key', 'mock-secret');
  }
}