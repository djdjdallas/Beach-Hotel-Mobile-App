import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/apiService';

// Popular Destinations
export const usePopularDestinationsQuery = () => {
  return useQuery({
    queryKey: ['popularDestinations'],
    queryFn: apiService.getPopularDestinations,
  });
};

// Categories
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: apiService.getCategories,
  });
};

// Search Queries
export const useHotelsQuery = (params, enabled = true) => {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => apiService.searchHotels(params),
    enabled,
  });
};

export const useRestaurantsQuery = (params, enabled = true) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => apiService.searchRestaurants(params),
    enabled,
  });
};

export const useAttractionsQuery = (params, enabled = true) => {
  return useQuery({
    queryKey: ['attractions', params],
    queryFn: () => apiService.searchAttractions(params),
    enabled,
  });
};

export const useShoppingQuery = (params, enabled = true) => {
  return useQuery({
    queryKey: ['shopping', params],
    queryFn: () => apiService.searchShopping(params),
    enabled,
  });
};

// Favorites
export const useFavoritesQuery = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: apiService.getFavorites,
  });
};

export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.addFavorite,
    onSuccess: (newFavorite) => {
      queryClient.setQueryData(['favorites'], (oldData) => {
        return [...(oldData || []), newFavorite];
      });
    },
  });
};

export const useRemoveFavoriteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.removeFavorite,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['favorites'], (oldData) => {
        return (oldData || []).filter(fav => fav.id !== id);
      });
    },
  });
};

// Tours
export const useToursQuery = (params) => {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: () => apiService.getTours(params),
  });
};

// Events
export const useEventsQuery = (params) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => apiService.getEvents(params),
  });
};

// Flights
export const useFlightSearchQuery = (params, enabled = true) => {
  return useQuery({
    queryKey: ['flights', params],
    queryFn: () => apiService.searchFlights(params),
    enabled: enabled && !!params.from && !!params.to,
  });
};

// Hotel Details
export const useHotelDetailsQuery = (hotelId) => {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => apiService.getHotelDetails(hotelId),
    enabled: !!hotelId,
  });
};

// Location Recommendations
export const useLocationRecommendationsQuery = (latitude, longitude, type) => {
  return useQuery({
    queryKey: ['recommendations', latitude, longitude, type],
    queryFn: () => apiService.getLocationRecommendations(latitude, longitude, type),
    enabled: !!latitude && !!longitude,
  });
};

// Generic Search
export const useSearchQuery = (query, filters, enabled = true) => {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => apiService.search(query, filters),
    enabled: enabled && !!query,
  });
};