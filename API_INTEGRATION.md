# API Integration Guide

## Overview
The app now supports real-time data through a combination of:
1. Mock data for development and testing
2. Backend API integration (when available)
3. External API integrations (Amadeus, Booking.com, Google Maps)

## Configuration

### Toggle Between Mock and Real Data
Edit `config/api.config.js`:

```javascript
// Use mock data (development)
USE_MOCK_DATA: true

// Use real APIs (production)
USE_MOCK_DATA: false
```

### Enable External APIs
```javascript
USE_EXTERNAL_APIS: {
  amadeus: true,  // Enable Amadeus flight search
  booking: true,  // Enable Booking.com hotel search
  google: true,   // Enable Google Maps
}
```

## API Services

### Core API Service (`services/apiService.js`)
- Centralized API client
- Automatic fallback to mock data
- Token-based authentication
- Request/response interceptors

### Available Endpoints

#### Home Screen
- `getPopularDestinations()` - Popular travel destinations
- `getCategories()` - Service categories (hotels, restaurants, etc.)

#### Search
- `searchHotels(params)` - Search hotels by location
- `searchRestaurants(params)` - Search restaurants
- `searchAttractions(params)` - Search attractions
- `searchShopping(params)` - Search shopping venues
- `searchFlights(params)` - Search flights

#### Favorites
- `getFavorites()` - Get user's favorites
- `addFavorite(item)` - Add to favorites
- `removeFavorite(id)` - Remove from favorites

#### Other Services
- `getTours(params)` - Get available tours
- `getEvents(params)` - Get local events
- `getHotelDetails(hotelId)` - Get detailed hotel info

## Using React Query

### Basic Usage
```javascript
import { useHotelsQuery } from '../hooks/useQueryHooks';

const MyComponent = () => {
  const { data, isLoading, error } = useHotelsQuery({
    latitude: 40.7128,
    longitude: -74.0060,
  });
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  
  return <HotelsList hotels={data} />;
};
```

### Available Query Hooks
- `usePopularDestinationsQuery()`
- `useCategoriesQuery()`
- `useHotelsQuery(params)`
- `useRestaurantsQuery(params)`
- `useAttractionsQuery(params)`
- `useFavoritesQuery()`
- `useAddFavoriteMutation()`
- `useRemoveFavoriteMutation()`

## Mock Data Structure

### Hotel Example
```javascript
{
  id: '1',
  name: 'Grand Royal Hotel',
  rating: 4.8,
  reviews: 2341,
  price: 299,
  currency: 'USD',
  image: 'https://...',
  location: {
    address: '123 5th Avenue',
    city: 'New York',
    latitude: 40.7614,
    longitude: -73.9776,
  },
  distance: 0.8,
  amenities: ['WiFi', 'Pool', 'Spa'],
}
```

### Restaurant Example
```javascript
{
  id: '4',
  name: 'The Golden Fork',
  rating: 4.7,
  reviews: 1542,
  priceRange: 2, // 1=$, 2=$$, 3=$$$, 4=$$$$
  cuisine: 'Italian',
  openNow: true,
  location: {...},
}
```

## Environment Variables

Create a `.env` file:
```
API_BASE_URL=https://api.roamly.com
AMADEUS_CLIENT_ID=your_amadeus_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret
RAPIDAPI_KEY=your_rapidapi_key
GOOGLE_MAPS_API_KEY=your_google_key
```

## Transitioning to Production

1. **Set up backend API**
   - Deploy the backend service
   - Update API_BASE_URL in .env
   - Implement authentication endpoints

2. **Configure external APIs**
   - Get API credentials
   - Update .env with keys
   - Enable in api.config.js

3. **Switch from mock data**
   - Set USE_MOCK_DATA to false
   - Test all features
   - Monitor error logs

4. **Performance optimization**
   - Enable caching
   - Implement pagination
   - Add loading states

## Error Handling

The app gracefully handles API failures:
1. Shows cached data if available
2. Falls back to mock data
3. Displays user-friendly error messages
4. Allows retry operations

## Testing

### With Mock Data
```javascript
// In api.config.js
USE_MOCK_DATA: true
```

### With Real APIs
```javascript
// In api.config.js
USE_MOCK_DATA: false
USE_EXTERNAL_APIS: {
  amadeus: true,
  booking: true,
  google: true,
}
```

## Troubleshooting

### Common Issues

1. **"Network request failed"**
   - Check internet connection
   - Verify API endpoints
   - Check CORS settings

2. **Empty results**
   - Verify API credentials
   - Check request parameters
   - Review API rate limits

3. **Slow performance**
   - Enable caching
   - Implement pagination
   - Optimize images

### Debug Mode
```javascript
// Enable debug logging
console.log('API Response:', response.data);
```