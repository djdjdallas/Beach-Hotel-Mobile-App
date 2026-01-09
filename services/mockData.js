// Mock data for development and fallback when API is unavailable

export const mockCategories = [
  { id: 'hotels', name: 'Hotels', icon: '🏨' },
  { id: 'restaurants', name: 'Restaurants', icon: '🍽️' },
  { id: 'attractions', name: 'Attractions', icon: '🎭' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
];

export const mockPopularDestinations = [
  { id: 1, name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', deals: 234 },
  { id: 2, name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', deals: 189 },
  { id: 3, name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', deals: 302 },
  { id: 4, name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', deals: 156 },
  { id: 5, name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', deals: 278 },
  { id: 6, name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400', deals: 198 },
];

export const mockHotels = [
  {
    id: '1',
    name: 'Grand Royal Hotel',
    rating: 4.8,
    reviews: 2341,
    price: 299,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    location: {
      address: '123 5th Avenue, Manhattan, New York, NY 10001',
      city: 'New York',
      country: 'USA',
      latitude: 40.7614,
      longitude: -73.9776,
    },
    distance: 0.8,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar', 'Room Service', 'Parking'],
    description: 'Experience luxury at its finest in the heart of Manhattan. Our 5-star hotel offers stunning city views and world-class amenities.',
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
  },
  {
    id: '2',
    name: 'Sunset Beach Resort',
    rating: 4.5,
    reviews: 1856,
    price: 199,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
    location: {
      address: '456 Ocean Drive, Miami Beach, FL 33139',
      city: 'Miami',
      country: 'USA',
      latitude: 25.7617,
      longitude: -80.1918,
    },
    distance: 2.1,
    amenities: ['Beach', 'Pool', 'Bar', 'WiFi', 'Restaurant', 'Water Sports'],
    description: 'Beachfront paradise with pristine white sand beaches and crystal clear waters. Perfect for a relaxing getaway.',
  },
  {
    id: '3',
    name: 'Mountain View Lodge',
    rating: 4.6,
    reviews: 923,
    price: 159,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    location: {
      address: '789 Mountain Road, Aspen, CO 81611',
      city: 'Aspen',
      country: 'USA',
      latitude: 39.1911,
      longitude: -106.8175,
    },
    distance: 5.3,
    amenities: ['Mountain View', 'Fireplace', 'Restaurant', 'Ski Storage', 'Hot Tub'],
    description: 'Cozy mountain retreat with breathtaking views of the Rockies. Ski-in/ski-out access in winter.',
  },
];

export const mockRestaurants = [
  {
    id: '4',
    name: 'The Golden Fork',
    rating: 4.7,
    reviews: 1542,
    priceRange: 2,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    location: {
      address: '321 Broadway, New York, NY 10013',
      city: 'New York',
      country: 'USA',
      latitude: 40.7195,
      longitude: -74.0089,
    },
    distance: 0.5,
    cuisine: 'Italian',
    openNow: true,
    hours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 11:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '10:00 AM - 9:00 PM',
    },
    features: ['Outdoor Seating', 'Wine Bar', 'Private Dining', 'Vegetarian Options'],
  },
  {
    id: '5',
    name: 'Sushi Paradise',
    rating: 4.9,
    reviews: 2103,
    priceRange: 3,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    location: {
      address: '456 Park Avenue, New York, NY 10022',
      city: 'New York',
      country: 'USA',
      latitude: 40.7614,
      longitude: -73.9714,
    },
    distance: 1.2,
    cuisine: 'Japanese',
    openNow: true,
    features: ['Omakase', 'Sake Bar', 'Private Rooms', 'Chef\'s Table'],
  },
  {
    id: '6',
    name: 'Burger House',
    rating: 4.4,
    reviews: 892,
    priceRange: 1,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    location: {
      address: '789 6th Street, Brooklyn, NY 11215',
      city: 'Brooklyn',
      country: 'USA',
      latitude: 40.6782,
      longitude: -73.9442,
    },
    distance: 0.9,
    cuisine: 'American',
    openNow: false,
    features: ['Craft Beer', 'Vegan Options', 'Takeout', 'Delivery'],
  },
];

export const mockAttractions = [
  {
    id: '7',
    name: 'City Museum',
    rating: 4.6,
    reviews: 3421,
    price: 25,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=400',
    location: {
      address: '1000 5th Avenue, New York, NY 10028',
      city: 'New York',
      country: 'USA',
      latitude: 40.7794,
      longitude: -73.9632,
    },
    distance: 1.5,
    type: 'Museum',
    openNow: true,
    hours: '10:00 AM - 5:30 PM',
    description: 'One of the world\'s largest and most comprehensive art museums.',
    highlights: ['Ancient Art', 'Modern Art', 'Special Exhibitions', 'Guided Tours'],
  },
  {
    id: '8',
    name: 'Central Park',
    rating: 4.8,
    reviews: 5634,
    price: 0,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400',
    location: {
      address: 'Central Park, New York, NY 10024',
      city: 'New York',
      country: 'USA',
      latitude: 40.7829,
      longitude: -73.9654,
    },
    distance: 2.0,
    type: 'Park',
    openNow: true,
    hours: '6:00 AM - 1:00 AM',
    description: 'Iconic 843-acre park in the heart of Manhattan.',
    highlights: ['Bethesda Fountain', 'Bow Bridge', 'Central Park Zoo', 'Great Lawn'],
  },
];

export const mockShopping = [
  {
    id: '9',
    name: 'Downtown Mall',
    rating: 4.3,
    reviews: 1823,
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400',
    location: {
      address: '100 Main Street, New York, NY 10001',
      city: 'New York',
      country: 'USA',
      latitude: 40.7505,
      longitude: -73.9934,
    },
    distance: 3.2,
    type: 'Shopping Mall',
    openNow: true,
    hours: '10:00 AM - 9:00 PM',
    stores: 150,
    features: ['Food Court', 'Cinema', 'Parking', 'Kids Play Area'],
  },
];

export const mockFavorites = [
  {
    id: '1',
    itemId: '1',
    type: 'hotel',
    name: 'Grand Royal Hotel',
    rating: 4.8,
    reviews: 2341,
    price: '$299',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    location: 'Manhattan, New York',
  },
  {
    id: '2',
    itemId: '4',
    type: 'restaurant',
    name: 'The Golden Fork',
    rating: 4.7,
    reviews: 1542,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    location: 'Brooklyn, New York',
  },
];

export const mockTours = [
  {
    id: 't1',
    name: 'NYC Walking Tour',
    duration: '3 hours',
    price: 45,
    currency: 'USD',
    rating: 4.7,
    reviews: 823,
    image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400',
    description: 'Explore the best of NYC with our expert guides',
    highlights: ['Times Square', 'Central Park', 'Brooklyn Bridge'],
    included: ['Professional Guide', 'Small Group', 'Photo Opportunities'],
  },
  {
    id: 't2',
    name: 'Statue of Liberty Tour',
    duration: '4 hours',
    price: 65,
    currency: 'USD',
    rating: 4.8,
    reviews: 1245,
    image: 'https://images.unsplash.com/photo-1503572327579-b5c6afe5c5c5?w=400',
    description: 'Visit the iconic Statue of Liberty and Ellis Island',
    highlights: ['Statue of Liberty', 'Ellis Island', 'Ferry Ride'],
    included: ['Ferry Tickets', 'Audio Guide', 'Museum Access'],
  },
];

export const mockEvents = [
  {
    id: 'e1',
    name: 'Broadway Show - Hamilton',
    date: '2024-02-15',
    time: '8:00 PM',
    price: 150,
    currency: 'USD',
    venue: 'Richard Rodgers Theatre',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
    category: 'Theater',
    availability: 'Limited',
  },
  {
    id: 'e2',
    name: 'Madison Square Garden Concert',
    date: '2024-02-20',
    time: '7:30 PM',
    price: 85,
    currency: 'USD',
    venue: 'Madison Square Garden',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
    category: 'Concert',
    availability: 'Available',
  },
];

// Helper function to simulate API delay
export const simulateApiDelay = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Helper function to get mock data by category
export const getMockDataByCategory = (category) => {
  switch (category) {
    case 'hotels':
      return mockHotels;
    case 'restaurants':
      return mockRestaurants;
    case 'attractions':
      return mockAttractions;
    case 'shopping':
      return mockShopping;
    default:
      return [];
  }
};